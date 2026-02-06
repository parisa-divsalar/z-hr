import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recordUserStateTransition } from '@/lib/user-state';

// Track processed event IDs for idempotency
const processedEvents = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validate webhook signature (placeholder - implement based on payment provider)
    // const isValid = validateSignature(request.headers, payload);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }
    
    const { event_type, customer_id, plan_id, credits_amount, event_id } = payload;
    
    // Validate required fields
    if (!event_type) {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 });
    }
    
    if (!customer_id) {
      return NextResponse.json({ error: 'customer_id is required' }, { status: 400 });
    }
    
    // Idempotency check
    if (event_id && processedEvents.has(event_id)) {
      return NextResponse.json({ 
        received: true, 
        message: 'Event already processed',
        duplicate: true 
      });
    }
    
    // Handle payment_success event
    if (event_type === 'payment_success') {
      const userId = Number(customer_id);
      
      if (!Number.isFinite(userId)) {
        return NextResponse.json({ error: 'Invalid customer_id' }, { status: 400 });
      }
      
      // Verify user exists
      const user = db.users.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      // Update user with payment success data
      const updateData: any = {
        plan_status: 'paid',
        payment_failed: false,
        just_converted: true,
        last_payment_at: new Date().toISOString(),
      };
      
      // Add credits if provided
      if (credits_amount !== undefined && credits_amount !== null) {
        const creditsNum = Number(credits_amount);
        if (Number.isFinite(creditsNum)) {
          updateData.credits = creditsNum;
          updateData.coin = creditsNum; // Support both field names
        }
      }
      
      db.users.update(userId, updateData);
      
      // Record user activity in state logs
      db.userStateLogs.append({
        user_id: userId,
        event_type: 'payment_success',
        meta: { plan_id, credits_amount },
      });
      
      // Update user state to "Paid – Just Converted"
      recordUserStateTransition(userId, {
        planStatus: 'paid',
        paymentFailed: false,
        justConverted: true,
        credits: credits_amount !== undefined ? Number(credits_amount) : null,
      }, {
        event: 'payment_success',
        plan_id,
      });
      
      // Mark event as processed
      if (event_id) {
        processedEvents.add(event_id);
      }
      
      return NextResponse.json({ 
        received: true,
        message: 'Payment success processed',
        user_id: userId,
      });
    }
    
    // Handle payment_failed event
    if (event_type === 'payment_failed') {
      const userId = Number(customer_id);
      
      if (!Number.isFinite(userId)) {
        return NextResponse.json({ error: 'Invalid customer_id' }, { status: 400 });
      }
      
      // Verify user exists
      const user = db.users.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      // Extract error details from payload
      const { error_code, error_message } = payload;
      
      // Update user with payment failed data
      db.users.update(userId, {
        payment_failed: true,
        plan_status: 'failed',
      });
      
      // Record user activity in state logs
      db.userStateLogs.append({
        user_id: userId,
        event_type: 'payment_failed',
        meta: { 
          error_code,
          error_message,
          raw_payload: payload,
        },
      });
      
      // Update user state to "Payment Failed"
      recordUserStateTransition(userId, {
        planStatus: 'failed',
        paymentFailed: true,
        justConverted: false,
      }, {
        event: 'payment_failed',
        error_code,
        error_message,
      });
      
      // Mark event as processed
      if (event_id) {
        processedEvents.add(event_id);
      }
      
      return NextResponse.json({ 
        received: true,
        message: 'Payment failed processed',
        user_id: userId,
      });
    }
    
    // Unknown event type
    return NextResponse.json({ 
      received: true,
      message: `Event type '${event_type}' not handled` 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
