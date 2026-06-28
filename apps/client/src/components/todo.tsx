import { animalsApi } from '@api/animals.service.ts';
import { useTranslation } from '@hooks/use-translation.tsx';
import type { AnimalTodo } from '@interfaces/animal-todo.ts';
import { Button } from '@mui/material';
import { Check, Clock, CheckSquare } from 'lucide-react';

import { formatDate } from '../utils/date-utils.ts';

interface Props {
    todo: AnimalTodo;
    completeTask: (todoId: number) => void;
}

function Todo({ todo, completeTask }: Props) {
    const { t } = useTranslation();

    const isPastDue = new Date(todo.due_date) < new Date();
    const isToday = new Date(todo.due_date).toDateString() === new Date().toDateString();

    const getBorderColor = () => {
        if (todo.completed_date) return 'border-emerald-200 bg-emerald-50/50';
        if (isPastDue) return 'border-red-200 bg-red-50/50';
        if (isToday) return 'border-teal-200 bg-teal-50/50';
        return 'border-gray-200 bg-white';
    };

    // Get cat emoji based on status
    const getCatEmoji = () => {
        if (todo.completed_date) return '😸'; // Happy cat for done
        if (isPastDue) return '😿'; // Crying cat for overdue
        return '😺'; // Smiling cat for normal/future tasks
    };

    return (
        <div className={`border rounded-2xl p-4 sm:p-5 transition-all hover:shadow-md ${getBorderColor()}`}>
            <div className="space-y-3">
                {/* Cat name and date row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{getCatEmoji()}</span>
                        <span className="text-sm font-semibold text-gray-700">{todo.assignee || t('you')}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{formatDate(todo.due_date)}</div>
                </div>

                {/* Task title */}
                <div className="text-base font-medium text-gray-900 leading-snug">{todo.message}</div>

                {/* Status indicator for overdue */}
                {isPastDue && todo.completed_date === null && (
                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{t('overdue')}</span>
                    </div>
                )}

                {/* Actions */}
                {todo.completed_date ? (
                    <div className="flex items-center gap-2 pt-2">
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                            <Check className="w-5 h-5" />
                            <span>{t('done')}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Button
                            href={todo.action_redirect}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                px: 3,
                                py: 1,
                                bgcolor: 'rgb(5 150 105)',
                                '&:hover': { bgcolor: 'rgb(4 120 87)' },
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                textTransform: 'none',
                            }}
                        >
                            {todo.action_label}
                        </Button>

                        <Button
                            sx={{
                                px: 3,
                                py: 1,
                                border: '2px solid rgb(5 150 105)',
                                color: 'rgb(4 120 87)',
                                '&:hover': { bgcolor: 'rgb(236 253 245)' },
                                fontWeight: 600,
                                borderRadius: '9999px',
                                transition: 'colors 0.2s',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                textTransform: 'none',
                            }}
                            onClick={() => completeTask(todo.id)}
                        >
                            <CheckSquare className="w-4 h-4" />
                            {t('markDone')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Todo;
