import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getUsers, addUser, setCurrentUser, User, initializeDefaultUsers } from '@/utils/storage';
import { Activity, UserCircle, Stethoscope, ShieldCheck } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize default users on component mount
  useState(() => {
    initializeDefaultUsers();
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const loginRole = formData.get('role') as 'patient' | 'doctor' | 'admin';

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === loginRole);

    if (user) {
      setCurrentUser(user);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });
      navigate(`/${user.role}`);
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials or role',
        variant: 'destructive',
      });
    }
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const specialization = formData.get('specialization') as string;

    const users = getUsers();
    
    if (users.some(u => u.email === email)) {
      toast({
        title: 'Signup failed',
        description: 'Email already exists',
        variant: 'destructive',
      });
      return;
    }

    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      password,
      role,
      name,
      phone: phone || undefined,
      specialization: role === 'doctor' ? specialization : undefined,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    setCurrentUser(newUser);
    
    toast({
      title: 'Signup successful',
      description: `Welcome, ${name}!`,
    });
    
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-4 rounded-full">
              <Activity className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">TeleMed Connect</h1>
          <p className="text-muted-foreground mt-2">Your Healthcare, Anywhere</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to access your dashboard' : 'Join our telemedicine platform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(v) => setIsLogin(v === 'login')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-role">Role</Label>
                    <Select name="role" defaultValue="patient" required>
                      <SelectTrigger id="login-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-4 w-4" />
                            Patient
                          </div>
                        </SelectItem>
                        <SelectItem value="doctor">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Doctor
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" name="email" type="email" placeholder="doctor@hospital.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" name="password" type="password" required />
                  </div>

                  <Button type="submit" className="w-full">Sign In</Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Demo: doctor@hospital.com / doctor123
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select name="role" value={role} onValueChange={(v) => setRole(v as any)} required>
                      <SelectTrigger id="signup-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-4 w-4" />
                            Patient
                          </div>
                        </SelectItem>
                        <SelectItem value="doctor">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Doctor
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" name="name" placeholder="John Doe" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="john@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" name="password" type="password" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone</Label>
                    <Input id="signup-phone" name="phone" type="tel" placeholder="+1234567890" />
                  </div>

                  {role === 'doctor' && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-specialization">Specialization</Label>
                      <Input id="signup-specialization" name="specialization" placeholder="e.g., Cardiology" required />
                    </div>
                  )}

                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
