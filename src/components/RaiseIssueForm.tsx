
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface RaiseIssueFormProps {
  onSubmit: (issueData: {
    title: string;
    pcNumber: string;
    location: string;
    description: string;
  }) => void;
}

const RaiseIssueForm = ({ onSubmit }: RaiseIssueFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [pcNumber, setPcNumber] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to report an issue');
      return;
    }
    
    if (!title || !pcNumber || !location || !description) {
      toast.error('Please fill in all fields');
      return;
    }
    
    onSubmit({
      title,
      pcNumber,
      location,
      description,
    });
    
    // Reset form
    setTitle('');
    setPcNumber('');
    setLocation('');
    setDescription('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Raise a New Issue</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              placeholder="Brief description of the problem"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pcNumber">PC Number</Label>
              <Input
                id="pcNumber"
                placeholder="e.g. PC001"
                value={pcNumber}
                onChange={(e) => setPcNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Room 101"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Please describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit Issue</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RaiseIssueForm;
