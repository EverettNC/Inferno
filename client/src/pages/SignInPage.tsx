import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
  const [, navigate] = useLocation();
  const { login } = useUserContext();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both username and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username, password);
      toast({
        title: "Sign in successful",
        description: "Welcome back to Inferno AI.",
      });
      navigate('/');
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Inferno AI</h1>
          <p className="text-text-secondary mb-8">Your trauma-informed companion</p>
        </div>
        
        <Card className="bg-bg-secondary border-border">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription className="text-text-secondary">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-input-bg border-input-border focus:ring-accent focus:border-accent"
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input-bg border-input-border focus:ring-accent focus:border-accent pr-10"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash" />
                    ) : (
                      <i className="fas fa-eye" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 accent-accent bg-input-bg border-input-border rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link href="/forgot-password">
                    <a className="text-accent hover:text-accent-subtle">
                      Forgot password?
                    </a>
                  </Link>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-button-bg hover:bg-button-hover text-text-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-bg-secondary px-2 text-text-secondary">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="bg-bg-tertiary border-border hover:bg-opacity-70">
                <i className="fab fa-google mr-2" />
                Google
              </Button>
              <Button variant="outline" className="bg-bg-tertiary border-border hover:bg-opacity-70">
                <i className="fab fa-apple mr-2" />
                Apple
              </Button>
            </div>
            
            <div className="text-center text-sm text-text-secondary mt-4">
              Don't have an account?{' '}
              <Link href="/signup">
                <a className="text-accent hover:text-accent-subtle">
                  Sign up
                </a>
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-xs text-text-secondary">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms">
              <a className="text-accent hover:text-accent-subtle">Terms of Service</a>
            </Link>{' '}
            and{' '}
            <Link href="/privacy">
              <a className="text-accent hover:text-accent-subtle">Privacy Policy</a>
            </Link>
          </p>
          <p className="mt-2">
            Inferno AI is not a replacement for professional mental health care.
          </p>
        </div>
      </div>
    </div>
  );
}