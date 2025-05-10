import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

export default function SubscriptionSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Simulate verifying the subscription
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setLocation('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">
              {isLoading ? 'Verifying Subscription' : 'Subscription Successful!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center py-8">
              {isLoading ? (
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              ) : (
                <CheckCircle className="h-16 w-16 text-primary" />
              )}
            </div>

            {!isLoading && (
              <div className="space-y-4 text-center">
                <p className="text-lg">
                  Thank you for subscribing to vibbly Premium!
                </p>
                <p className="text-muted-foreground">
                  You now have full access to all premium features. Start creating amazing video clips today!
                </p>
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={handleContinue}
                >
                  Continue to vibbly
                </Button>
              </div>
            )}

            {isLoading && (
              <p className="text-center text-muted-foreground">
                Please wait while we verify your subscription...
              </p>
            )}
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}