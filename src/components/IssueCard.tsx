import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Issue, IssueStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { formatDistance } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  onUpdateStatus?: (id: string, status: IssueStatus, notes?: string) => void;
}

const statusColors = {
  pending: 'bg-orange-500 hover:bg-orange-600',
  inProgress: 'bg-blue-500 hover:bg-blue-600',
  resolved: 'bg-green-500 hover:bg-green-600',
};

const statusLabels = {
  pending: 'Pending',
  inProgress: 'In Progress',
  resolved: 'Resolved',
};

const IssueCard = ({ issue, onUpdateStatus }: IssueCardProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [adminNotes, setAdminNotes] = useState(issue.adminNotes || '');
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = (newStatus: IssueStatus) => {
    setStatus(newStatus);
  };

  const handleSave = () => {
    if (onUpdateStatus) {
      onUpdateStatus(issue.id, status, adminNotes);
    }
    setIsEditing(false);
  };

  const getTimeAgo = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  return (
    <Card className="w-full mb-4 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{issue.title}</CardTitle>
            <CardDescription>PC #{issue.pcNumber} - {issue.location}</CardDescription>
          </div>
          <Badge className={statusColors[issue.status]}>
            {statusLabels[issue.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-700">{issue.description}</p>
        </div>
        
        {issue.adminNotes && !isEditing && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-semibold">Admin Notes:</p>
            <p className="text-sm">{issue.adminNotes}</p>
          </div>
        )}
        
        {isAdmin && isEditing && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(val) => handleStatusChange(val as IssueStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Admin Notes</label>
              <Textarea 
                placeholder="Add notes about this issue"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-gray-500">
          Created {getTimeAgo(issue.createdAt)}
          {issue.updatedAt !== issue.createdAt && 
            ` • Updated ${getTimeAgo(issue.updatedAt)}`}
        </div>
        
        {isAdmin && (
          <div>
            {isEditing ? (
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>Save</Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Update
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default IssueCard;
