import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function SubscriptionCancel() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">
            Subscription Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center py-8">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>

          <div className="space-y-4 text-center">
            <p className="text-lg">
              Your subscription process was cancelled.
            </p>
            <p className="text-muted-foreground">
              You can subscribe at any time to access premium features and start creating amazing video clips.
            </p>
            <div className="flex flex-col space-y-2 pt-4">
              <Button 
                className="w-full" 
                onClick={() => setLocation('/subscribe')}
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setLocation('/login')}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}