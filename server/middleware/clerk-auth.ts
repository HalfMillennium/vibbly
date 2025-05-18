import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { storage } from '../storage';

// Type extension for Express Request
declare global {
  namespace Express {
    interface Request {
      clerkUser?: any;
      clerkId?: string;
      auth: {
        userId: string | null;
        sessionId: string | null;
        getToken: () => Promise<string | null>;
      };
    }
  }
}

// Middleware to verify Clerk token and attach user info
export const requireClerkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip auth for specific routes
    if (req.path === '/api/health' || req.path.startsWith('/api/public')) {
      return next();
    }

    const { userId } = req.auth;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Get the Clerk user
      const clerkUser = await clerkClient.users.getUser(userId);
      req.clerkUser = clerkUser;
      req.clerkId = userId;

      // Check if user exists in our database
      const dbUser = await storage.getUserByClerkId(userId);
      
      // If not in our database, create the user
      if (!dbUser) {
        // Get primary email
        const primaryEmail = clerkUser.emailAddresses.find(
          email => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress;

        if (!primaryEmail) {
          return res.status(400).json({ message: 'User email not found' });
        }

        await storage.createUser({
          email: primaryEmail,
          username: clerkUser.username || `user-${clerkUser.id.substring(0, 8)}`,
          clerkId: userId
        });
      }

      next();
    } catch (error: any) {
      console.error('Error verifying Clerk auth:', error);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Clerk auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if the user has an active subscription
export const requireSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get user from our database
    const user = await storage.getUserByClerkId(userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if the user has a Stripe customer ID (indicates they've subscribed)
    if (!user.stripeCustomerId) {
      return res.status(403).json({ 
        message: 'Subscription required',
        subscriptionRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};