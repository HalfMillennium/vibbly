import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Define the extended request interface
declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string | null;
        sessionId: string | null;
        getToken: () => Promise<string | null>;
      }
    }
  }
}

// Middleware to check if the user has an active Stripe subscription
export const requireStripeSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Get user from our database using Clerk ID
    const user = await storage.getUserByClerkId(req.auth.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if the user has a Stripe customer ID (indicates they've paid)
    if (!user.stripeCustomerId) {
      return res.status(403).json({ 
        message: 'Subscription required',
        requireSubscription: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in subscription middleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};