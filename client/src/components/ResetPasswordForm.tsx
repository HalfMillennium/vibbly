import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

// Define the form validation schema
const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isLoaded, signIn } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      
      // Start the password reset process with Clerk
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      });

      setEmailSent(true);
      
      toast({
        title: 'Reset email sent',
        description: 'Check your inbox for a password reset link.',
      });
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      toast({
        title: 'Request failed',
        description: error.errors?.[0]?.message || 'Could not process your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a password reset link. Please check your email inbox.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => setLocation('/login')}
          >
            Return to sign in
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              disabled={isLoading || !isLoaded}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isLoaded}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending request...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
          <p className="text-center text-sm">
            Remember your password?{' '}
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => setLocation('/login')}
              disabled={isLoading}
            >
              Back to sign in
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}