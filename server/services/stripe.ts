import Stripe from 'stripe';
import { User } from '@shared/schema';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define the URL of your frontend application
const APP_URL = process.env.APP_URL || 'http://localhost:5000';

// Create a Stripe checkout session for subscription
export async function createCheckoutSession(user: User) {
  // If user doesn't have a Stripe customer ID yet, create one
  let customerId = user.stripeCustomerId;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id.toString(),
      },
    });
    
    customerId = customer.id;
  }
  
  // Create the checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'ClipCraft Premium',
            description: 'Unlimited access to ClipCraft video clipping features',
          },
          unit_amount: 999, // $9.99 in cents
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/subscription/cancel`,
  });
  
  return session;
}

// Create a customer portal session
export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/account`,
  });
  
  return session;
}

// Verify subscription status
export async function verifySubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  // Just return the status which is always available
  return {
    status: subscription.status,
    // We'll add more properties when we know they're available and needed
  };
}

// Process webhook events from Stripe
export async function handleWebhookEvent(event: Stripe.Event) {
  const { type, data } = event;
  
  switch (type) {
    case 'checkout.session.completed': {
      const session = data.object as Stripe.Checkout.Session;
      
      // Handle the completed checkout session
      if (session.mode === 'subscription') {
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        
        // Return the subscription ID and customer ID for further processing
        return {
          type: 'subscription.created',
          customerId,
          subscriptionId,
        };
      }
      break;
    }
    
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = data.object as Stripe.Subscription;
      const status = subscription.status;
      const customerId = subscription.customer as string;
      
      return {
        type: 'subscription.updated',
        customerId,
        subscriptionId: subscription.id,
        status,
      };
    }
    
    default:
      // Unhandled event type
      return null;
  }
  
  return null;
}