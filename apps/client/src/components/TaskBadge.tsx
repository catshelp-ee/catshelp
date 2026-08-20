import { AlertCircle, Clock } from 'lucide-react';

export type TaskStatus = 'overdue' | 'due-soon' | 'upcoming' | 'completed';

interface TaskBadgeProps {
  status: TaskStatus;
  count?: number;
}

export function TaskBadge({ status, count }: TaskBadgeProps) {
  const config = {
    overdue: {
      icon: AlertCircle,
      className: 'bg-red-100 text-red-700 border-red-200',
      label: 'Overdue',
    },
    'due-soon': {
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      label: 'Due Soon',
    },
    upcoming: {
      icon: Clock,
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      label: 'Upcoming',
    },
    completed: {
      icon: Clock,
      className: 'bg-green-100 text-green-700 border-green-200',
      label: 'Completed',
    },
  };

  const { icon: Icon, className, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${className}`}>
      <Icon className="w-3 h-3 shrink-0" />
      {count !== undefined ? `${count}` : label}
    </span>
  );
}