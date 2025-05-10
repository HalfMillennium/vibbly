import { useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function Subscribe() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/subscription/checkout');
      
      if (response.ok) {
        const { url } = await response.json();
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        const errorData = await response.json();
        toast({
          title: 'Subscription Error',
          description: errorData.message || 'Failed to initiate checkout process',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Subscription Error',
        description: 'An error occurred during the subscription process. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/subscription/portal');
      
      if (response.ok) {
        const { url } = await response.json();
        // Redirect to Stripe Customer Portal
        window.location.href = url;
      } else {
        const errorData = await response.json();
        toast({
          title: 'Portal Access Error',
          description: errorData.message || 'Failed to access customer portal',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Portal Access Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold md:text-4xl">
            ClipCraft Premium Subscription
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to ClipCraft's powerful video clipping tools and features
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Monthly Subscription</CardTitle>
              <div className="flex justify-center items-baseline mt-4">
                <span className="text-5xl font-extrabold">$9.99</span>
                <span className="text-xl text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Create unlimited video clips',
                  'Advanced customization options',
                  'Premium sharing features',
                  'HD quality exports',
                  'Priority support',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Subscribe Now'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Already Subscribed?</CardTitle>
              <CardDescription>
                Manage your subscription, update payment details, or change your plan
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3 h-full flex flex-col justify-center">
                <p className="text-center">
                  Access your Stripe Customer Portal to view billing history and manage your subscription
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleManageSubscription}
                disabled={isLoading}
              >
                Manage Subscription
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation('/login')}
            disabled={isLoading}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}