import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, UserCircle, Stethoscope, ShieldCheck, Calendar, MessageSquare, FileText } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-muted">
      <header className="border-b bg-card/80 backdrop-blur-sm shadow-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Activity className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">TeleMed Connect</h1>
          </div>
          <Button onClick={() => navigate('/auth')} size="lg">
            Get Started
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-4">
            Healthcare at Your Fingertips
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with doctors, manage appointments, and access prescriptions - all in one secure platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-card hover:shadow-soft transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">For Patients</h3>
              <p className="text-muted-foreground mb-4">
                Book appointments, consult with doctors online, and manage your health records
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Easy appointment booking
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Direct chat with doctors
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Digital prescriptions
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">For Doctors</h3>
              <p className="text-muted-foreground mb-4">
                Manage your schedule, consult patients remotely, and provide care efficiently
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  Appointment management
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-secondary" />
                  Patient consultations
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-secondary" />
                  E-prescription system
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">For Admins</h3>
              <p className="text-muted-foreground mb-4">
                Oversee the platform, manage users, and monitor all activities
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-accent-foreground" />
                  User management
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                  Appointment oversight
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent-foreground" />
                  System analytics
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button onClick={() => navigate('/auth')} size="lg" className="text-lg px-8 py-6">
            Start Your Journey
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
