import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Apple, Salad } from 'lucide-react';
import LoginChat from '@/components/LoginChat';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in to Aliva.',
      });
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast({
        title: 'Full name required',
        description: 'Please enter your full name to create an account.',
        variant: 'destructive',
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome to Aliva!',
        description: 'Your account has been created successfully.',
      });
      // Small delay to show the success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-white flex items-center justify-center p-3 sm:p-4">
      <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
        {/* Left: Auth Card */}
        <div className="w-full max-w-md mx-auto order-2 md:order-1">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Salad className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Aliva</span>
            </div>
            <p className="text-muted-foreground">Your AI-powered nutrition companion</p>
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Salad className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Aliva
            </span>
          </div>
          <p className="text-muted-foreground">Your AI-powered nutrition companion</p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white border border-primary/10 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome</CardTitle>
              <CardDescription>Sign in or create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input id="signin-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input id="signin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full rounded-full h-11 sm:h-12 bg-gradient-to-b from-primary-dark to-primary text-white" disabled={isLoading}>
                      {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>) : ('Sign In')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input id="signup-name" type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                    </div>
                    <Button type="submit" className="w-full rounded-full h-11 sm:h-12 bg-gradient-to-b from-primary-dark to-primary text-white" disabled={isLoading}>
                      {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>) : ('Create Account')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>

        {/* Right: Chat */}
        <div className="w-full max-w-xl mx-auto order-1 md:order-2 md:mt-4">
          <div className="rounded-[20px] sm:rounded-[28px] bg-white shadow-xl border border-black/5 p-3 sm:p-4">
            <LoginChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;