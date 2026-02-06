import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const { userId, templateKey, data } = await req.json();

    if (!userId || !templateKey) {
      return NextResponse.json(
        { error: 'userId and templateKey are required' },
        { status: 400 }
      );
    }

    const success = await sendNotification(userId, templateKey, data);

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid template key' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// GET endpoint to find abandoned resumes and trigger notifications
export async function GET(req: NextRequest) {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const wizardData = db.wizardData.findAll();
    const resumeDrafts = db.resumeDrafts.findAll();

    const abandonedUsers = new Set<number>();

    // Check wizard_data for abandoned starts
    wizardData.forEach((wizard: any) => {
      const updatedAt = new Date(wizard.updated_at);
      if (updatedAt < threeDaysAgo && wizard.status !== 'completed') {
        abandonedUsers.add(wizard.user_id);
      }
    });

    // Check resume_drafts for abandoned drafts
    resumeDrafts.forEach((draft: any) => {
      const updatedAt = new Date(draft.updated_at);
      if (updatedAt < threeDaysAgo && draft.status !== 'completed') {
        abandonedUsers.add(draft.user_id);
      }
    });

    const notifications: any[] = [];

    for (const userId of abandonedUsers) {
      const success = await sendNotification(
        userId.toString(),
        'RESUME_ABANDONMENT'
      );
      if (success) {
        notifications.push({ userId, sent: true });
      }
    }

    return NextResponse.json({
      success: true,
      abandonedCount: abandonedUsers.size,
      notificationsSent: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error detecting abandoned resumes:', error);
    return NextResponse.json(
      { error: 'Failed to process abandoned resumes' },
      { status: 500 }
    );
  }
}
