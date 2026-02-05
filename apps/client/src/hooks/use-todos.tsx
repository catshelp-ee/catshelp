import {useEffect, useState} from 'react';
import {AnimalSummary} from "@interfaces/animal-summary";
import {AnimalTodo} from "@interfaces/animal-todo";
import {animalsApi} from "@api/animals.service";

export function useTodos(animals: AnimalSummary[]) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!animals || animals.length === 0) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchTodos = async () => {
            setLoading(true);
            setError(null);

            try {
                const allTodos: AnimalTodo[] = [];
                for (let i = 0; i < animals.length; i++) {
                    const animalSummary = animals[i];

                    const todos = await animalsApi.getTodos(animalSummary.id);
                    allTodos.push(...todos);
                }

                if (isMounted) {
                    setTodos(allTodos);
                }
            } catch (e) {
                if (isMounted) {
                    setError(e as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTodos();

        return () => {
            isMounted = false;
        };
    }, [animals]);

    return { todos, loading, error };
}