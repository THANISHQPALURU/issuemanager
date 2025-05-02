
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Issue } from '@/types';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Clock, Check } from 'lucide-react';

interface IssueHistogramProps {
  issues: Issue[];
}

const IssueHistogram: React.FC<IssueHistogramProps> = ({ issues }) => {
  // Count issues by status
  const countByStatus = {
    pending: issues.filter(issue => issue.status === 'pending').length,
    inProgress: issues.filter(issue => issue.status === 'inProgress').length,
    resolved: issues.filter(issue => issue.status === 'resolved').length
  };

  // Prepare data for the chart
  const data = [
    { name: 'Pending', count: countByStatus.pending, color: '#FEC6A1' },
    { name: 'In Progress', count: countByStatus.inProgress, color: '#0EA5E9' },
    { name: 'Resolved', count: countByStatus.resolved, color: '#86EFAC' }
  ];

  // Configuration for status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <HelpCircle className="h-4 w-4" />;
      case 'In Progress':
        return <Clock className="h-4 w-4" />;
      case 'Resolved':
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Issue Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ChartContainer 
            config={{
              Pending: { label: 'Pending', color: '#FEC6A1', icon: () => getStatusIcon('Pending') },
              'In Progress': { label: 'In Progress', color: '#0EA5E9', icon: () => getStatusIcon('In Progress') },
              Resolved: { label: 'Resolved', color: '#86EFAC', icon: () => getStatusIcon('Resolved') }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueHistogram;
