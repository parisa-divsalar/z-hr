import { db } from '../db';
import { resolveUserState, ResolveStateInput } from '../user-state';

// Mock the db module
jest.mock('../db', () => ({
  db: {
    users: {
      findById: jest.fn(),
      update: jest.fn(),
    },
    cvs: {
      findByUserId: jest.fn(),
    },
    resumeDrafts: {
      findAll: jest.fn(),
    },
    wizardData: {
      findAll: jest.fn(),
    },
    interviewSessions: {
      findAll: jest.fn(),
    },
    coverLetters: {
      findAll: jest.fn(),
    },
    resumeSectionOutputs: {
      findAll: jest.fn(),
    },
    userStateLogs: {
      findAll: jest.fn(),
    },
    userStateHistory: {
      append: jest.fn(),
    },
  },
}));

describe('User State Resolver', () => {
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockDb.cvs.findByUserId.mockReturnValue([]);
    mockDb.resumeDrafts.findAll.mockReturnValue([]);
    mockDb.wizardData.findAll.mockReturnValue([]);
    mockDb.interviewSessions.findAll.mockReturnValue([]);
    mockDb.coverLetters.findAll.mockReturnValue([]);
    mockDb.resumeSectionOutputs.findAll.mockReturnValue([]);
    mockDb.userStateLogs.findAll.mockReturnValue([]);
  });

  describe('Guest state', () => {
    it('returns Guest for non-existent user', () => {
      mockDb.users.findById.mockReturnValue(null);
      
      const input: ResolveStateInput = { userId: 999 };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Guest');
      expect(result.reason).toBe('user_not_found');
    });
  });

  describe('Not Verified state', () => {
    it('returns Registered – Not Verified for unverified user', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: false 
      });
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: false 
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Registered – Not Verified');
      expect(result.reason).toBe('not_verified');
    });
  });

  describe('Payment Failed state', () => {
    it('returns Payment Failed for payment_failed=true', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        payment_failed: true
      });
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        paymentFailed: true 
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Payment Failed');
      expect(result.reason).toBe('payment_failed');
    });

    it('returns Payment Failed for plan_status=failed', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        plan_status: 'failed'
      });
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        planStatus: 'failed'
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Payment Failed');
      expect(result.reason).toBe('payment_failed');
    });
  });

  describe('Dormant User state', () => {
    it('returns Churn-risk User for 30+ days inactive (churn-risk has priority)', () => {
      const thirtyOneDaysAgo = new Date();
      thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
      
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        last_active_at: thirtyOneDaysAgo.toISOString()
      });
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        lastActiveAt: thirtyOneDaysAgo.toISOString()
      };
      const result = resolveUserState(input);
      
      // Churn-risk check happens before dormant (inactivity >= 14 days triggers churn-risk)
      expect(result.state).toBe('Churn-risk User');
      expect(result.reason).toBe('churn_risk');
    });

    it('does not return Dormant User for less than 30 days inactive', () => {
      const twentyDaysAgo = new Date();
      twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
      
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        last_active_at: twentyDaysAgo.toISOString()
      });
      mockDb.cvs.findByUserId.mockReturnValue([{ id: 1, user_id: 1 }]);
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        lastActiveAt: twentyDaysAgo.toISOString()
      };
      const result = resolveUserState(input);
      
      expect(result.state).not.toBe('Dormant User');
    });
  });

  describe('Resume states', () => {
    it('returns Registered – No Resume for verified user without resume', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true
      });
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true 
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Registered – No Resume');
      expect(result.reason).toBe('no_resume');
    });

    it('returns Started Resume – Incomplete for started but incomplete resume', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true
      });
      mockDb.resumeDrafts.findAll.mockReturnValue([{ id: 1, user_id: 1 }]);
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true 
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Started Resume – Incomplete');
      expect(result.reason).toBe('resume_incomplete');
    });

    it('returns Free – First Resume Completed for completed first resume', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true
      });
      mockDb.cvs.findByUserId.mockReturnValue([{ id: 1, user_id: 1 }]);
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true 
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Free – First Resume Completed');
      expect(result.reason).toBe('first_resume');
    });
  });

  describe('Paid User states', () => {
    it('returns Paid – Just Converted for newly converted user', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        plan_status: 'paid',
        just_converted: true
      });
      mockDb.cvs.findByUserId.mockReturnValue([{ id: 1, user_id: 1 }]);
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        planStatus: 'paid',
        justConverted: true
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Paid – Just Converted');
      expect(result.reason).toBe('just_converted');
    });

    it('returns Paid – Credit Exhausted for paid user with zero credits', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        plan_status: 'paid',
        credits: 0
      });
      mockDb.cvs.findByUserId.mockReturnValue([{ id: 1, user_id: 1 }]);
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        planStatus: 'paid',
        credits: 0
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Paid – Credit Exhausted');
      expect(result.reason).toBe('credits_exhausted');
    });

    it('returns Paid – Active for active paid user', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        plan_status: 'paid',
        credits: 100
      });
      mockDb.cvs.findByUserId.mockReturnValue([{ id: 1, user_id: 1 }]);
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        planStatus: 'paid',
        credits: 100
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Paid – Active');
      expect(result.reason).toBe('paid_active');
    });
  });

  describe('State priority order', () => {
    it('prioritizes Payment Failed over Churn-risk', () => {
      const thirtyOneDaysAgo = new Date();
      thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
      
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        payment_failed: true,
        last_active_at: thirtyOneDaysAgo.toISOString()
      });
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        paymentFailed: true,
        lastActiveAt: thirtyOneDaysAgo.toISOString()
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Payment Failed');
      expect(result.reason).toBe('payment_failed');
    });

    it('prioritizes Churn-risk over Not Verified', () => {
      const thirtyOneDaysAgo = new Date();
      thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
      
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: false,
        last_active_at: thirtyOneDaysAgo.toISOString()
      });
      mockDb.userStateLogs.findAll.mockReturnValue([]);
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: false,
        lastActiveAt: thirtyOneDaysAgo.toISOString()
      };
      const result = resolveUserState(input);
      
      // Churn-risk should be checked before not verified
      expect(result.state).toBe('Churn-risk User');
    });
  });

  describe('Feature Blocked state', () => {
    it('returns Free – Feature Blocked for blocked users', () => {
      mockDb.users.findById.mockReturnValue({ 
        id: 1, 
        email: 'test@example.com',
        is_verified: true,
        feature_blocked: true
      });
      mockDb.cvs.findByUserId.mockReturnValue([{ id: 1, user_id: 1 }]);
      
      const input: ResolveStateInput = { 
        userId: 1, 
        isVerified: true,
        featureBlocked: true
      };
      const result = resolveUserState(input);
      
      expect(result.state).toBe('Free – Feature Blocked');
      expect(result.reason).toBe('feature_blocked');
    });
  });
});
