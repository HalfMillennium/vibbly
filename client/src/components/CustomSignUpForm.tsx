import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
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
const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function CustomSignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isLoaded, signUp } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: SignUpFormData) => {
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      
      // Start the sign-up process with Clerk using their API
      const result = await signUp.create({
        username: data.username,
        emailAddress: data.email,
        password: data.password,
      });
      
      if (result.status === 'complete') {
        // If no verification is needed
        toast({
          title: 'Sign up successful',
          description: 'Your account has been created.',
        });
        setLocation('/subscription-check');
      } else {
        // Initiate email verification if needed
        setPendingVerification(true);
        setVerifying(true);
        
        toast({
          title: 'Verification email sent',
          description: 'Please check your email to complete registration.',
        });
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Sign up failed',
        description: error.errors?.[0]?.message || 'Could not create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification
  const handleVerification = async (code: string) => {
    if (!isLoaded || !pendingVerification) return;
    
    try {
      setIsLoading(true);
      
      // Complete the sign-up process with the verification code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code
      });
      
      if (completeSignUp.status === 'complete') {
        // Successful verification
        toast({
          title: 'Verification successful',
          description: 'Your account has been verified. You can now subscribe.',
        });
        
        // Redirect to subscription check page
        setLocation('/subscription-check');
      } else {
        // If additional verification steps are needed
        toast({
          title: 'Additional verification needed',
          description: 'Please follow the instructions to complete verification.',
        });
      }
    } catch (error: any) {
      console.error('Error verifying email:', error);
      toast({
        title: 'Verification failed',
        description: error.errors?.[0]?.message || 'Could not verify your email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render verification form if needed
  if (verifying) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                if (e.target.value.length === 6) {
                  handleVerification(e.target.value);
                }
              }}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="button"
            className="w-full"
            onClick={() => handleVerification(verificationCode)}
            disabled={isLoading || verificationCode.length < 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
          <p className="text-center text-sm">
            Didn't receive a code?{' '}
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto"
              onClick={async () => {
                if (isLoaded && pendingVerification) {
                  try {
                    // Resend verification email
                    await signUp.prepareEmailAddressVerification();
                    toast({
                      title: 'Code resent',
                      description: 'A new verification code has been sent to your email.',
                    });
                  } catch (error: any) {
                    toast({
                      title: 'Failed to resend code',
                      description: error.message || 'Please try again later',
                      variant: 'destructive',
                    });
                  }
                }
              }}
              disabled={isLoading}
            >
              Resend code
            </Button>
          </p>
        </CardFooter>
      </Card>
    );
  }

  // Render sign-up form
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Join vibbly</CardTitle>
        <CardDescription className="text-center">
          Create an account to start making video clips
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              disabled={isLoading || !isLoaded}
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading || !isLoaded}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={isLoading || !isLoaded}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
          <p className="text-center text-sm">
            Already have an account?{' '}
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => setLocation('/login')}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}