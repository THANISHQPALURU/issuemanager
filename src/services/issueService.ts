
import { Issue } from '@/types';
import { initialIssues } from '@/data/mockData';

// Get issues from localStorage or default to initialIssues if none exist
const getStoredIssues = (): Issue[] => {
  const storedIssues = localStorage.getItem('issues');
  return storedIssues ? JSON.parse(storedIssues) : initialIssues;
};

// Store issues in localStorage
const storeIssues = (issues: Issue[]): void => {
  localStorage.setItem('issues', JSON.stringify(issues));
};

// Get all issues
export const getAllIssues = (): Issue[] => {
  return getStoredIssues();
};

// Get issues for a specific user
export const getUserIssues = (userId: string): Issue[] => {
  const issues = getStoredIssues();
  return issues.filter(issue => issue.userId === userId);
};

// Add a new issue
export const addIssue = (issue: Issue): Issue[] => {
  const issues = getStoredIssues();
  const updatedIssues = [issue, ...issues];
  storeIssues(updatedIssues);
  return updatedIssues;
};

// Update an issue
export const updateIssue = (
  id: string, 
  status: Issue['status'], 
  adminNotes?: string, 
  adminId?: string
): Issue[] => {
  const issues = getStoredIssues();
  const updatedIssues = issues.map(issue => 
    issue.id === id
      ? {
          ...issue,
          status,
          adminNotes,
          adminId,
          updatedAt: new Date().toISOString()
        }
      : issue
  );
  storeIssues(updatedIssues);
  return updatedIssues;
};
