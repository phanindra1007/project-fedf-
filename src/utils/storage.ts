// LocalStorage utilities for managing application data

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  phone?: string;
  specialization?: string; // for doctors
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor';
  receiverId: string;
  appointmentId: string;
  message: string;
  timestamp: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  medications: string;
  instructions: string;
  date: string;
}

export interface DoctorAvailability {
  doctorId: string;
  availableDays: string[];
  availableHours: { start: string; end: string };
}

const STORAGE_KEYS = {
  USERS: 'telemedicine_users',
  APPOINTMENTS: 'telemedicine_appointments',
  MESSAGES: 'telemedicine_messages',
  PRESCRIPTIONS: 'telemedicine_prescriptions',
  AVAILABILITY: 'telemedicine_availability',
  CURRENT_USER: 'telemedicine_current_user',
};

// Initialize default admin if doesn't exist
export const initializeDefaultUsers = () => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultAdmin: User = {
      id: 'admin-001',
      email: 'admin@hospital.com',
      password: 'admin123',
      role: 'admin',
      name: 'Admin',
      createdAt: new Date().toISOString(),
    };
    
    const defaultDoctor: User = {
      id: 'doctor-001',
      email: 'doctor@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      name: 'Dr. Smith',
      specialization: 'General Physician',
      phone: '+1234567890',
      createdAt: new Date().toISOString(),
    };
    
    saveUsers([defaultAdmin, defaultDoctor]);
  }
};

// User operations
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Appointment operations
export const getAppointments = (): Appointment[] => {
  const appointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return appointments ? JSON.parse(appointments) : [];
};

export const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const addAppointment = (appointment: Appointment) => {
  const appointments = getAppointments();
  appointments.push(appointment);
  saveAppointments(appointments);
};

export const updateAppointment = (id: string, updates: Partial<Appointment>) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(apt => apt.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates };
    saveAppointments(appointments);
  }
};

// Message operations
export const getMessages = (): Message[] => {
  const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return messages ? JSON.parse(messages) : [];
};

export const saveMessages = (messages: Message[]) => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

export const addMessage = (message: Message) => {
  const messages = getMessages();
  messages.push(message);
  saveMessages(messages);
};

// Prescription operations
export const getPrescriptions = (): Prescription[] => {
  const prescriptions = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
  return prescriptions ? JSON.parse(prescriptions) : [];
};

export const savePrescriptions = (prescriptions: Prescription[]) => {
  localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
};

export const addPrescription = (prescription: Prescription) => {
  const prescriptions = getPrescriptions();
  prescriptions.push(prescription);
  savePrescriptions(prescriptions);
};

// Doctor availability operations
export const getAvailability = (): DoctorAvailability[] => {
  const availability = localStorage.getItem(STORAGE_KEYS.AVAILABILITY);
  return availability ? JSON.parse(availability) : [];
};

export const saveAvailability = (availability: DoctorAvailability[]) => {
  localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(availability));
};

export const updateDoctorAvailability = (doctorId: string, availability: DoctorAvailability) => {
  const allAvailability = getAvailability();
  const index = allAvailability.findIndex(a => a.doctorId === doctorId);
  
  if (index !== -1) {
    allAvailability[index] = availability;
  } else {
    allAvailability.push(availability);
  }
  
  saveAvailability(allAvailability);
};
