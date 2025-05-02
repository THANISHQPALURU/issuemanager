
import { User, Issue } from '../types';

export const users: User[] = [
  {
    id: '1',
    username: 'user',
    password: 'password',
    role: 'user',
    name: 'John Doe'
  },
  {
    id: '2',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    name: 'Admin User'
  }
];

export const initialIssues: Issue[] = [
  {
    id: '1',
    userId: '1',
    title: 'Computer not turning on',
    description: 'When I press the power button, nothing happens. The power supply fan does not spin.',
    pcNumber: 'PC001',
    location: 'Room 101',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    userId: '1',
    title: 'Screen flickering',
    description: 'The monitor display flickers every few minutes.',
    pcNumber: 'PC002',
    location: 'Room 205',
    status: 'inProgress',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    adminNotes: 'Checking graphics drivers',
    adminId: '2'
  },
  {
    id: '3',
    userId: '1',
    title: 'Software installation needed',
    description: 'Need to install Adobe Creative Suite on this computer.',
    pcNumber: 'PC003',
    location: 'Design Lab',
    status: 'resolved',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    adminNotes: 'Software installed and tested',
    adminId: '2'
  }
];
