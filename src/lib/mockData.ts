// Mock data for users, login attempts, and chats
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  projectIntent: string;
  createdAt: Date;
  lastActive: Date;
}

export interface LoginAttempt {
  id: string;
  userId: string;
  timestamp: Date;
  status: "success" | "failed";
  ipAddress: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    fullName: "John Smith",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    emailVerified: true,
    projectIntent: "Building a modern office complex",
    createdAt: new Date("2026-05-20"),
    lastActive: new Date("2026-05-26"),
  },
  {
    id: "user-2",
    fullName: "Sarah Johnson",
    email: "sarah@example.com",
    phoneNumber: "+1987654321",
    emailVerified: true,
    projectIntent: "Residential home renovation",
    createdAt: new Date("2026-05-18"),
    lastActive: new Date("2026-05-25"),
  },
  {
    id: "user-3",
    fullName: "Michael Chen",
    email: "michael@example.com",
    phoneNumber: "+1555666777",
    emailVerified: false,
    projectIntent: "Sustainable eco-village design",
    createdAt: new Date("2026-05-15"),
    lastActive: new Date("2026-05-26"),
  },
  {
    id: "user-4",
    fullName: "Emma Davis",
    email: "emma@example.com",
    phoneNumber: "+1444555666",
    emailVerified: true,
    projectIntent: "Shopping mall layout planning",
    createdAt: new Date("2026-05-22"),
    lastActive: new Date("2026-05-24"),
  },
  {
    id: "user-5",
    fullName: "David Brown",
    email: "david@example.com",
    phoneNumber: "+1222333444",
    emailVerified: true,
    projectIntent: "Hospital facility expansion",
    createdAt: new Date("2026-05-19"),
    lastActive: new Date("2026-05-26"),
  },
];

// Mock login attempts
export const mockLoginAttempts: LoginAttempt[] = [
  {
    id: "attempt-1",
    userId: "user-1",
    timestamp: new Date("2026-05-26T10:30:00"),
    status: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "attempt-2",
    userId: "user-1",
    timestamp: new Date("2026-05-26T14:15:00"),
    status: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "attempt-3",
    userId: "user-2",
    timestamp: new Date("2026-05-26T09:45:00"),
    status: "success",
    ipAddress: "192.168.1.101",
  },
  {
    id: "attempt-4",
    userId: "user-3",
    timestamp: new Date("2026-05-26T11:20:00"),
    status: "failed",
    ipAddress: "192.168.1.102",
  },
  {
    id: "attempt-5",
    userId: "user-1",
    timestamp: new Date("2026-05-25T15:00:00"),
    status: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "attempt-6",
    userId: "user-4",
    timestamp: new Date("2026-05-26T16:30:00"),
    status: "success",
    ipAddress: "192.168.1.103",
  },
  {
    id: "attempt-7",
    userId: "user-3",
    timestamp: new Date("2026-05-26T12:00:00"),
    status: "failed",
    ipAddress: "192.168.1.104",
  },
  {
    id: "attempt-8",
    userId: "user-5",
    timestamp: new Date("2026-05-26T13:45:00"),
    status: "success",
    ipAddress: "192.168.1.105",
  },
];

// Mock chats
export const mockChats: ChatMessage[] = [
  {
    id: "msg-1",
    userId: "user-1",
    role: "assistant",
    content: "Hello! Before we start your architectural consultation, please share your full name.",
    timestamp: new Date("2026-05-26T10:30:00"),
  },
  {
    id: "msg-2",
    userId: "user-1",
    role: "user",
    content: "My name is John Smith",
    timestamp: new Date("2026-05-26T10:31:00"),
  },
  {
    id: "msg-3",
    userId: "user-1",
    role: "assistant",
    content: "Great to meet you, John! Can you please share your email address?",
    timestamp: new Date("2026-05-26T10:32:00"),
  },
  {
    id: "msg-4",
    userId: "user-1",
    role: "user",
    content: "john@example.com",
    timestamp: new Date("2026-05-26T10:33:00"),
  },
  {
    id: "msg-5",
    userId: "user-1",
    role: "assistant",
    content: "Thank you, John! Now, what is your phone number?",
    timestamp: new Date("2026-05-26T10:34:00"),
  },
  {
    id: "msg-6",
    userId: "user-1",
    role: "user",
    content: "+1234567890",
    timestamp: new Date("2026-05-26T10:35:00"),
  },
  {
    id: "msg-7",
    userId: "user-1",
    role: "assistant",
    content: "Perfect! Can you tell me about your project intent? What kind of architectural project are you working on?",
    timestamp: new Date("2026-05-26T10:36:00"),
  },
  {
    id: "msg-8",
    userId: "user-1",
    role: "user",
    content: "I'm working on building a modern office complex. I need help with the layout and sustainability features.",
    timestamp: new Date("2026-05-26T10:37:00"),
  },
  {
    id: "msg-9",
    userId: "user-1",
    role: "assistant",
    content: "Excellent! A modern office complex with sustainability focus. That's a great project. For the layout, I recommend:\n\n1. Open floor plans to maximize natural light\n2. Green spaces on multiple levels\n3. Energy-efficient HVAC systems\n4. Smart building automation\n\nLet's discuss your specific requirements in detail.",
    timestamp: new Date("2026-05-26T10:38:00"),
  },
  {
    id: "msg-10",
    userId: "user-2",
    role: "assistant",
    content: "Hello! Before we start your architectural consultation, please share your full name.",
    timestamp: new Date("2026-05-26T09:45:00"),
  },
  {
    id: "msg-11",
    userId: "user-2",
    role: "user",
    content: "I'm Sarah Johnson",
    timestamp: new Date("2026-05-26T09:46:00"),
  },
  {
    id: "msg-12",
    userId: "user-2",
    role: "assistant",
    content: "Nice to meet you, Sarah! What's your email address?",
    timestamp: new Date("2026-05-26T09:47:00"),
  },
  {
    id: "msg-13",
    userId: "user-2",
    role: "user",
    content: "sarah@example.com",
    timestamp: new Date("2026-05-26T09:48:00"),
  },
];

export function getUsers() {
  return mockUsers;
}

export function getUserById(userId: string) {
  return mockUsers.find((u) => u.id === userId);
}

export function getLoginAttempts(userId?: string) {
  if (userId) {
    return mockLoginAttempts.filter((a) => a.userId === userId);
  }
  return mockLoginAttempts;
}

export function getChatsByUserId(userId: string) {
  return mockChats.filter((c) => c.userId === userId);
}
