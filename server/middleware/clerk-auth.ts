import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { storage } from '../storage';

// Check for Clerk API key
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('Missing required Clerk secret: CLERK_SECRET_KEY');
}

/**
 * Middleware to verify the Clerk JWT token
 */
export const requireClerkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the session token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Clerk
    let clerkUserId;
    
    try {
      // Verify JWT token using Clerk's client
      const { sub } = await clerkClient.verifyToken(token);
      clerkUserId = sub;
      
      if (!clerkUserId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
    }
    
    // Get user from Clerk
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      
      if (!clerkUser) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
      }
      
      // Check if the user exists in our database
      let user = await storage.getUserByClerkId(clerkUser.id);
      
      // If user doesn't exist in our database, create a new one
      if (!user) {
        // Get primary email
        const primaryEmail = clerkUser.emailAddresses.find(
          email => email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress;
        
        if (!primaryEmail) {
          return res.status(400).json({ error: 'User has no primary email address' });
        }
        
        // Create user in our database
        user = await storage.createUser({
          clerkId: clerkUser.id,
          email: primaryEmail,
          username: clerkUser.username || primaryEmail.split('@')[0],
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          subscriptionStatus: null,
        });
      }
      
      // Attach the user to the request object
      req.user = user;
      
      // Add isAuthenticated method
      req.isAuthenticated = () => true;
      
      next();
    } catch (error) {
      console.error('Error getting user from Clerk:', error);
      return res.status(401).json({ error: 'Unauthorized: Failed to retrieve user information' });
    }
  } catch (error) {
    console.error('Error verifying Clerk authentication:', error);
    return res.status(401).json({ error: 'Unauthorized: Authentication failed' });
  }
};

/**
 * Middleware to check if the user has a subscription
 */
export const requireSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    
    // Check if the user has an active subscription
    if (!req.user.subscriptionStatus || req.user.subscriptionStatus !== 'active') {
      return res.status(403).json({ error: 'Subscription required to access this resource' });
    }
    
    next();
  } catch (error) {
    console.error('Error checking subscription:', error);
    return res.status(500).json({ error: 'Server error checking subscription status' });
  }
};

/**
 * Middleware that attaches auth methods to the request
 */
export const attachAuthMethods = (req: Request, res: Response, next: NextFunction) => {
  req.isAuthenticated = () => req.user !== undefined;
  next();
};