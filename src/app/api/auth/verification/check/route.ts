import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { sendNotification } from '@/lib/notifications';

export async function GET() {
  try {
    const users = db.users.findAll();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    const unverifiedUsers = users.filter((u: any) => {
      const isVerified =
        u?.is_verified === true || 
        u?.email_verified === true || 
        u?.verified_at;
      
      if (isVerified) return false;
      
      const createdAt = new Date(u.created_at).getTime();
      return createdAt < oneDayAgo;
    });
    
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
