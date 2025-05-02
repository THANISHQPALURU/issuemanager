
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export type IssueStatus = 'pending' | 'inProgress' | 'resolved';

export interface Issue {
  id: string;
  userId: string;
  title: string;
  description: string;
  pcNumber: string;
  location: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  adminId?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}
