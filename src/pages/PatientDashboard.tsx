import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser, setCurrentUser, getUsers, getAppointments, addAppointment, getPrescriptions, Appointment } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { Calendar, LogOut, FileText, MessageSquare, Clock, User, Stethoscope } from 'lucide-react';
import ChatBox from '@/components/ChatBox';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'patient') {
      navigate('/auth');
      return;
    }
    loadData();
  }, []);

  const loadData = () => {
    const allAppointments = getAppointments();
    const myAppointments = allAppointments.filter(apt => apt.patientId === currentUser?.id);
    setAppointments(myAppointments);

    const allPrescriptions = getPrescriptions();
    const myPrescriptions = allPrescriptions.filter(p => p.patientId === currentUser?.id);
    setPrescriptions(myPrescriptions);

    const allUsers = getUsers();
    const doctorList = allUsers.filter(u => u.role === 'doctor');
    setDoctors(doctorList);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/auth');
  };

  const handleBookAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const doctorId = formData.get('doctorId') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const reason = formData.get('reason') as string;

    const doctor = doctors.find(d => d.id === doctorId);
    
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: currentUser!.id,
      patientName: currentUser!.name,
      doctorId,
      doctorName: doctor?.name || 'Unknown',
      date,
      time,
      status: 'pending',
      reason,
      createdAt: new Date().toISOString(),
    };

    addAppointment(newAppointment);
    loadData();
    
    toast({
      title: 'Appointment booked',
      description: 'Your appointment request has been submitted',
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {currentUser?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="prescriptions">
              <FileText className="mr-2 h-4 w-4" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="book">
              <Stethoscope className="mr-2 h-4 w-4" />
              Book New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No appointments yet. Book your first appointment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map(apt => (
                      <Card key={apt.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{apt.doctorName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {new Date(apt.date).toLocaleDateString()} at {apt.time}
                              </div>
                              {apt.reason && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Reason: {apt.reason}
                                </p>
                              )}
                            </div>
                            <Badge className={getStatusColor(apt.status)}>
                              {apt.status}
                            </Badge>
                          </div>
                          
                          {(apt.status === 'confirmed' || apt.status === 'completed') && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedAppointment(apt)}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Chat with Doctor
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl h-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Consultation Chat</DialogTitle>
                                  <DialogDescription>
                                    Communicate with your doctor
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedAppointment && (
                                  <div className="flex-1 overflow-hidden">
                                    <ChatBox
                                      appointmentId={selectedAppointment.id}
                                      otherUserId={selectedAppointment.doctorId}
                                      otherUserName={selectedAppointment.doctorName}
                                      otherUserRole="doctor"
                                    />
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Prescriptions</CardTitle>
                <CardDescription>View your digital prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                {prescriptions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No prescriptions available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map(prescription => (
                      <Card key={prescription.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-semibold">Dr. {prescription.doctorName}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(prescription.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Medications:</p>
                              <p className="text-sm text-muted-foreground">{prescription.medications}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Instructions:</p>
                              <p className="text-sm text-muted-foreground">{prescription.instructions}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="book">
            <Card>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
                <CardDescription>Schedule a consultation with a doctor</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Select Doctor</Label>
                    <Select name="doctorId" required>
                      <SelectTrigger id="doctor">
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map(doctor => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            <div>
                              <div className="font-medium">{doctor.name}</div>
                              <div className="text-xs text-muted-foreground">{doctor.specialization}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" name="date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" name="time" type="time" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea id="reason" name="reason" placeholder="Describe your symptoms..." />
                  </div>

                  <Button type="submit" className="w-full">Book Appointment</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatientDashboard;
