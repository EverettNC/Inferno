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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Sign in form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 bg-bg-primary">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-accent bg-opacity-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Inferno AI</h1>
            <p className="text-text-secondary mb-8">Your trauma-informed companion</p>
          </div>
          
          <Card className="bg-bg-secondary border-border shadow-md">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription className="text-text-secondary">
                Sign in to continue your healing journey
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
                    <button type="button" className="text-accent hover:text-accent-subtle">
                      Forgot password?
                    </button>
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
                <button type="button" className="text-accent hover:text-accent-subtle">
                  Sign up
                </button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-xs text-text-secondary">
            <p>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <p className="mt-2">
              Inferno AI is not a replacement for professional mental health care.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - App features */}
      <div className="hidden md:block md:w-1/2 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-30"></div>
        
        <div className="h-full flex flex-col justify-center px-12 relative z-10">
          <h2 className="text-3xl font-bold mb-8">Your Supportive Space</h2>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent bg-opacity-15 flex items-center justify-center mr-4">
                <i className="fas fa-mountain text-accent text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Grounding Techniques</h3>
                <p className="text-text-secondary">
                  Access proven 5-4-3-2-1 sensory grounding exercises to help reconnect with the present moment.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-info bg-opacity-15 flex items-center justify-center mr-4">
                <i className="fas fa-wind text-info text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Breathing Exercises</h3>
                <p className="text-text-secondary">
                  Guided breathing patterns help regulate your nervous system during heightened stress.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary bg-opacity-15 flex items-center justify-center mr-4">
                <i className="fas fa-brain text-secondary text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Voice Interaction</h3>
                <p className="text-text-secondary">
                  Hands-free support with full voice capabilities for accessibility during difficult moments.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-bg-tertiary p-6 rounded-lg border border-border shadow-md">
            <p className="italic text-text-secondary">
              "Inferno AI has been my anchor during panic attacks. The grounding exercises help me find stability when I'm spiraling."
            </p>
            <p className="mt-2 font-medium">— Alex, PTSD Survivor</p>
          </div>
        </div>
      </div>
    </div>
  );
}