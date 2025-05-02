
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import IssueCard from '@/components/IssueCard';
import RaiseIssueForm from '@/components/RaiseIssueForm';
import IssueHistogram from '@/components/IssueHistogram';
import { useAuth } from '@/context/AuthContext';
import { Issue } from '@/types';
import { toast } from 'sonner';
import { getUserIssues, addIssue } from '@/services/issueService';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }
    
    // Load only this user's issues from persistent storage
    const userIssues = getUserIssues(user.id);
    setIssues(userIssues);
  }, [user, navigate]);
  
  const handleCreateIssue = (issueData: any) => {
    if (!user) return;
    
    const newIssue: Issue = {
      id: `${Date.now()}`,
      userId: user.id,
      title: issueData.title,
      pcNumber: issueData.pcNumber,
      location: issueData.location,
      description: issueData.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Use the service to add the issue which will persist it
    const updatedIssues = addIssue(newIssue);
    setIssues(updatedIssues.filter(issue => issue.userId === user.id));
    toast.success('Issue reported successfully');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">PC Issue Tracker</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="issues">
          <TabsList className="mb-8">
            <TabsTrigger value="issues">My Issues</TabsTrigger>
            <TabsTrigger value="new">Report New Issue</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Reported Issues</h2>
              </div>
              
              <Separator />
              
              {issues.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't reported any issues yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="max-w-2xl mx-auto">
              <RaiseIssueForm onSubmit={handleCreateIssue} />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">My Issues Analytics</h2>
              <Separator />
              <div className="max-w-3xl mx-auto">
                <IssueHistogram issues={issues} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;
