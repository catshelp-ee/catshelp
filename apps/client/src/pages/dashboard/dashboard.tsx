import { useAnimals } from '@hooks/use-animals.tsx';
import { useTodos } from '@hooks/use-todos.tsx';
import AuthStore from '@stores/AuthStore.ts';
import React from 'react';

const Dashboard = () => {
    /*const { animals, loading: animalsLoading, error: animalsError } = useAnimals();
    const { todos, loading: todosLoading, error: todosError } = useTodos(animals);
    const { user } = AuthStore;
    */

    return <div className="flex flex-col flex-1">TEST</div>;
};

export default Dashboard;
