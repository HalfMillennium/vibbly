import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function VerificationSuccess() {
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useUser();
  const { toast } = useToast();

  // Redirect to subscription check if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Show success toast
      toast({
        title: 'Verification successful',
        description: 'Your email has been verified successfully.',
      });
      
      // Small delay before redirect
      const timer = setTimeout(() => {
        setLocation('/subscription-check');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, setLocation, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <AppHeader />
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Email Verified</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Your email has been successfully verified. You can now access all features of vibbly.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full" 
              onClick={() => setLocation('/subscription-check')}
            >
              Continue to subscription
            </Button>
          </CardFooter>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}