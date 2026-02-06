import { db } from './db';

export interface NotificationTemplate {
  subject: string;
  body: string;
  channel: 'email' | 'in-app' | 'both';
}

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  RESUME_ABANDONMENT: {
    subject: 'Your resume is saved',
    body: "You're just a few steps away from completing your resume. Pick up where you left off.",
    channel: 'both'
  },
  BUYERS_REMORSE: {
    subject: "Let's get your first paid win",
    body: "Start with this 2-minute improvement: try our Job Description Match feature to tailor your resume to a specific role.",
    channel: 'both'
  },
  NOT_VERIFIED: {
    subject: 'Just one step left',
    body: 'We need to verify your email to save your progress. Click the link we sent you.',
    channel: 'email'
  }
};

export async function sendNotification(
  userId: string,
  templateKey: string,
  data?: Record<string, any>
): Promise<boolean> {
  const template = NOTIFICATION_TEMPLATES[templateKey];
  if (!template) return false;

  // Log notification (actual send would integrate with email service)
  console.log(`[Notification] Sending ${templateKey} to user ${userId}`);

  // Record in history
  await db.userStateLogs.append({
    user_id: parseInt(userId),
    event: 'notification_sent',
    payload: { template: templateKey, channel: template.channel, ...data },
    created_at: new Date().toISOString()
  });

  return true;
}
