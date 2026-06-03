import { formatDate } from '@catshelp/utils/src/date-utils.ts';
import { useTranslation } from '@hooks/use-translation.tsx';
import type { AnimalTodo } from '@interfaces/animal-todo.ts';
import { Button } from '@mui/material';
import { Check, Clock, FileText, CheckSquare, BookOpen, Calendar, Upload, PencilLine } from 'lucide-react';

interface Props {
    todo: AnimalTodo;
}

function Todo({ todo }: Props) {
    const { t } = useTranslation();

    const isPastDue = new Date(todo.due) < new Date();
    const isToday = new Date(todo.due).toDateString() === new Date().toDateString();

    const getBorderColor = () => {
        if (todo.completed) return 'border-emerald-200 bg-emerald-50/50';
        if (isPastDue) return 'border-red-200 bg-red-50/50';
        if (isToday) return 'border-teal-200 bg-teal-50/50';
        return 'border-gray-200 bg-white';
    };

    // Get cat emoji based on status
    const getCatEmoji = () => {
        if (todo.completed) return '😸'; // Happy cat for done
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
                    <div className="text-sm text-gray-600 font-medium">{formatDate(todo.due)}</div>
                </div>

                {/* Task title */}
                <div className="text-base font-medium text-gray-900 leading-snug">{todo.label}</div>

                {/* Status indicator for overdue */}
                {isPastDue && (
                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{t('overdue')}</span>
                    </div>
                )}

                {/* Actions */}
                {todo.completed ? (
                    <div className="flex items-center gap-2 pt-2">
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                            <Check className="w-5 h-5" />
                            <span>{t('done')}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Button
                            href={todo.action.redirect}
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
                            {todo.action.label}
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
