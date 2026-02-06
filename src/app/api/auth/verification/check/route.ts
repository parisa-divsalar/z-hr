import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendNotification } from '@/lib/notifications';

export async function GET() {
  try {
    // Find all users
    const users = db.users.findAll();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    // Filter unverified users who signed up > 24 hours ago
    const unverifiedUsers = users.filter((u: any) => {
      // Check if user is not verified
      const isVerified = 
        u?.is_verified === true || 
        u?.email_verified === true || 
        u?.verified_at;
      
      if (isVerified) return false;
      
      // Check if created > 24 hours ago
      const createdAt = new Date(u.created_at).getTime();
      return createdAt < oneDayAgo;
    });
    
    // Send reminders to each unverified user
    const reminded = [];
    for (const user of unverifiedUsers) {
      try {
        await sendNotification(user.id.toString(), 'NOT_VERIFIED', {
          email: user.email,
          name: user.name
        });
        reminded.push(user.id);
      } catch (error) {
        console.error(`Failed to send reminder to user ${user.id}:`, error);
      }
    }
    
    return NextResponse.json({ 
      reminded: reminded.length,
      users: reminded
    });
  } catch (error: any) {
    console.error('Verification check error:', error);
    return NextResponse.json({ 
      error: 'Verification check failed',
      details: error.message 
    }, { status: 500 });
  }
}
