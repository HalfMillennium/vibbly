import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Add user type to Express Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated(): boolean;
    }
  }
}

// Middleware to check if the user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  res.status(401).json({ message: "Authentication required" });
};

// Middleware to check if the user has an active subscription
export const hasActiveSubscription = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // Check if the user has an active subscription
  if (req.user.subscriptionStatus === 'active') {
    return next();
  }
  
  // User is authenticated but does not have an active subscription
  res.status(403).json({ 
    message: "Subscription required",
    redirectUrl: "/api/subscription/checkout" 
  });
};

// Add isAuthenticated method to Request
export const attachAuthMethods = (req: Request, res: Response, next: NextFunction) => {
  req.isAuthenticated = function() {
    return !!req.user;
  };
  next();
};