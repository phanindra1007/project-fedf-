import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, setCurrentUser, getAppointments, updateAppointment, addPrescription, Appointment } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { Calendar, LogOut, FileText, MessageSquare, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import ChatBox from '@/components/ChatBox';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'doctor') {
      navigate('/auth');
      return;
    }
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const allAppointments = getAppointments();
    const myAppointments = allAppointments.filter(apt => apt.doctorId === currentUser?.id);
    setAppointments(myAppointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/auth');
  };

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    updateAppointment(id, { status });
    loadAppointments();
    toast({
      title: 'Status updated',
      description: `Appointment ${status}`,
    });
  };

  const handleAddPrescription = (e: React.FormEvent<HTMLFormElement>, appointment: Appointment) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const medications = formData.get('medications') as string;
    const instructions = formData.get('instructions') as string;

    const prescription = {
      id: `presc-${Date.now()}`,
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: currentUser!.id,
      doctorName: currentUser!.name,
      medications,
      instructions,
      date: new Date().toISOString(),
    };

    addPrescription(prescription);
    updateAppointment(appointment.id, { status: 'completed' });
    loadAppointments();
    
    toast({
      title: 'Prescription added',
      description: 'Prescription saved and appointment marked as completed',
    });

    (e.target as HTMLFormElement).reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-warning text-warning-foreground';
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {currentUser?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{pendingAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-muted-foreground">{completedAppointments.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedAppointments.length})
            </TabsTrigger>
          </TabsList>

          {[
            { value: 'pending', data: pendingAppointments },
            { value: 'upcoming', data: upcomingAppointments },
            { value: 'completed', data: completedAppointments }
          ].map(({ value, data }) => (
            <TabsContent key={value} value={value} className="space-y-4">
              {data.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No {value} appointments</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                data.map(apt => (
                  <Card key={apt.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{apt.patientName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {new Date(apt.date).toLocaleDateString()} at {apt.time}
                          </div>
                          {apt.reason && (
                            <div className="text-sm">
                              <span className="font-medium">Reason: </span>
                              <span className="text-muted-foreground">{apt.reason}</span>
                            </div>
                          )}
                        </div>
                        <Badge className={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {apt.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </>
                        )}

                        {(apt.status === 'confirmed' || apt.status === 'completed') && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAppointment(apt)}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Chat
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl h-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Patient Consultation</DialogTitle>
                                  <DialogDescription>
                                    Chat with {apt.patientName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 overflow-hidden">
                                  <ChatBox
                                    appointmentId={apt.id}
                                    otherUserId={apt.patientId}
                                    otherUserName={apt.patientName}
                                    otherUserRole="patient"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>

                            {apt.status === 'confirmed' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Add Prescription
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Prescription</DialogTitle>
                                    <DialogDescription>
                                      Create a digital prescription for {apt.patientName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form onSubmit={(e) => handleAddPrescription(e, apt)} className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="medications">Medications</Label>
                                      <Textarea
                                        id="medications"
                                        name="medications"
                                        placeholder="List medications with dosage..."
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="instructions">Instructions</Label>
                                      <Textarea
                                        id="instructions"
                                        name="instructions"
                                        placeholder="Usage instructions and additional notes..."
                                        required
                                      />
                                    </div>
                                    <Button type="submit" className="w-full">
                                      Save Prescription
                                    </Button>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default DoctorDashboard;
