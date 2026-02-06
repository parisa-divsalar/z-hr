import { db } from '@/lib/db';
import { recordUserStateTransition } from '@/lib/user-state';

export interface CreditConsumptionResult {
  success: boolean;
  remainingCredits: number;
  error?: string;
}

/**
 * Consume credits from a user account for paid feature usage
 * @param userId - User ID as string or number
 * @param amount - Number of credits to deduct
 * @param feature - Feature name for logging (e.g., 'cover_letter', 'skill_gap', 'interview_questions')
 * @returns Result object with success status and remaining credits
 */
export async function consumeCredit(
  userId: string | number,
  amount: number,
  feature: string
): Promise<CreditConsumptionResult> {
  const userIdNum = Number(userId);
  
  if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
    return {
      success: false,
      remainingCredits: 0,
      error: 'Invalid user ID',
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false,
      remainingCredits: 0,
      error: 'Invalid credit amount',
    };
  }

  const user = db.users.findById(userIdNum);
  
  if (!user) {
    return {
      success: false,
      remainingCredits: 0,
      error: 'User not found',
    };
  }

  const currentCredits = Number((user as any)?.credits ?? (user as any)?.coin ?? 0);

  if (currentCredits < amount) {
    return {
      success: false,
      remainingCredits: currentCredits,
      error: 'Insufficient credits',
    };
  }

  const newCredits = currentCredits - amount;

  // Update user credits
  db.users.update(userIdNum, {
    credits: newCredits,
    coin: newCredits, // Keep both fields in sync
  } as any);

  // Log the credit consumption activity
  db.userStateLogs.append({
    user_id: userIdNum,
    event_type: `credit_consumed_${feature}`,
    meta: {
      feature,
      amount,
      previous_credits: currentCredits,
      new_credits: newCredits,
    },
  });

  // Check if credits are exhausted
  if (newCredits <= 0) {
    // Log credit exhaustion event
    db.userStateLogs.append({
      user_id: userIdNum,
      event_type: 'credit_exhausted',
      meta: { feature, last_amount: amount },
    });

    // Transition user state to "Paid – Credit Exhausted"
    recordUserStateTransition(
      userIdNum,
      {
        credits: newCredits,
        planStatus: 'paid',
      },
      {
        event: 'credit_exhausted',
        feature,
      }
    );
  }

  return {
    success: true,
    remainingCredits: newCredits,
  };
}

/**
 * Check if user has enough credits for a feature
 * @param userId - User ID as string or number
 * @param amount - Number of credits required
 * @returns true if user has sufficient credits, false otherwise
 */
export function hasEnoughCredits(userId: string | number, amount: number): boolean {
  const userIdNum = Number(userId);
  
  if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
    return false;
  }

  const user = db.users.findById(userIdNum);
  
  if (!user) {
    return false;
  }

  const currentCredits = Number((user as any)?.credits ?? (user as any)?.coin ?? 0);
  
  return currentCredits >= amount;
}

/**
 * Get user's current credit balance
 * @param userId - User ID as string or number
 * @returns Current credit balance, or 0 if user not found
 */
export function getUserCredits(userId: string | number): number {
  const userIdNum = Number(userId);
  
  if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
    return 0;
  }

  const user = db.users.findById(userIdNum);
  
  if (!user) {
    return 0;
  }

  return Number((user as any)?.credits ?? (user as any)?.coin ?? 0);
}
