import Todo from '@components/todo.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';
import type { AnimalTodos } from '@interfaces/animal-todo.ts';
import React from 'react';

interface props {
    todos?: AnimalTodos;
}

function Todos({ todos }: props) {
    const { t } = useTranslation();
    return (
        <div>
            <div className="space-y-6">
                {/* Today */}
                {todos.today.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {t('today')}
                        </h3>
                        <div className="space-y-2">
                            {todos.today.map((todo) => (
                                <Todo todo={todo} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Soon */}
                {todos.soon.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                            {t('soon')}
                        </h3>
                        <div className="space-y-2">
                            {todos.soon.map((todo) => (
                                <Todo todo={todo} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Later */}
                {todos.later.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            {t('later')}
                        </h3>
                        <div className="space-y-2">
                            {todos.later.map((todo) => (
                                <Todo todo={todo} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state 
                {filteredTodos.filter((t) => t.status !== 'done').length === 0 && (
                    <EmptyState icon={<CheckCircle2 className="w-16 h-16" />} title={t(translations.noTasks, language)} />
                )}
                  */}
            </div>
            {/* Completed tasks (last 2 weeks) */}
            {todos.completed.length > 0 && (
                <section>
                    <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        {t('done')}
                    </h3>
                    <div className="space-y-2">
                        {todos.completed.map((todo) => (
                            <Todo todo={todo} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Todos;
