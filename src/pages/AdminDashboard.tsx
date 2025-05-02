
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import IssueCard from '@/components/IssueCard';
import IssueHistogram from '@/components/IssueHistogram';
import { useAuth } from '@/context/AuthContext';
import { Issue, IssueStatus } from '@/types';
import { toast } from 'sonner';
import { getAllIssues, updateIssue } from '@/services/issueService';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    // Load all issues from persistent storage
    const allIssues = getAllIssues();
    setIssues(allIssues);
    setFilteredIssues(allIssues);
  }, [user, navigate]);
  
  useEffect(() => {
    let filtered = [...issues];
    
    // Filter by status if not on 'all' tab
    if (activeTab !== 'all' && activeTab !== 'analytics') {
      filtered = filtered.filter(issue => issue.status === activeTab);
    }
    
    // Apply search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        issue =>
          issue.title.toLowerCase().includes(query) ||
          issue.pcNumber.toLowerCase().includes(query) ||
          issue.location.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredIssues(filtered);
  }, [issues, searchQuery, activeTab]);
  
  const handleUpdateIssue = (id: string, status: IssueStatus, notes?: string) => {
    // Use the service to update the issue and persist the change
    const updatedIssues = updateIssue(id, status, notes, user?.id);
    setIssues(updatedIssues);
    toast.success('Issue updated successfully');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">PC Issue Tracker - Admin</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Manage Issues</h2>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <Input
              placeholder="Search issues..."
              className="max-w-sm"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <Separator className="mb-6" />

          <TabsContent value="analytics">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Issue Analytics</h2>
              <div className="max-w-3xl mx-auto">
                <IssueHistogram issues={issues} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No issues found.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onUpdateStatus={handleUpdateIssue} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending issues found.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onUpdateStatus={handleUpdateIssue} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inProgress">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No in-progress issues found.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onUpdateStatus={handleUpdateIssue} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resolved">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No resolved issues found.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onUpdateStatus={handleUpdateIssue} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
