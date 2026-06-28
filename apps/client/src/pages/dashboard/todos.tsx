import Todo from '@components/todo.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';
import type { AnimalTodos } from '@interfaces/animal-todo.ts';

interface props {
    todos: AnimalTodos;
    completeTask: (todoId: number) => void;
}

function Todos({ todos, completeTask }: props) {
    const { t } = useTranslation();

    return (
        <div>
            <div className="space-y-6">
                {todos.today.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {t('today')}
                        </h3>
                        <div className="space-y-2">
                            {todos.today.map((todo) => (
                                <Todo completeTask={completeTask} todo={todo} />
                            ))}
                        </div>
                    </div>
                )}

                {todos.soon.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                            {t('soon')}
                        </h3>
                        <div className="space-y-2">
                            {todos.soon.map((todo) => (
                                <Todo completeTask={completeTask} todo={todo} />
                            ))}
                        </div>
                    </div>
                )}

                {todos.later.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            {t('later')}
                        </h3>
                        <div className="space-y-2">
                            {todos.later.map((todo) => (
                                <Todo completeTask={completeTask} todo={todo} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {todos.completed.length > 0 && (
                <section>
                    <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        {t('done')}
                    </h3>
                    <div className="space-y-2">
                        {todos.completed.map((todo) => (
                            <Todo completeTask={completeTask} todo={todo} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Todos;
