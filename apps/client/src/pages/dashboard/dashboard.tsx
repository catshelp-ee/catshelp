import { useAnimals } from '@hooks/use-animals.tsx';
import { useTodos } from '@hooks/use-todos.tsx';
import AuthStore from '@stores/AuthStore.ts';
import React from 'react';

import Todos from './todos.tsx';

const Dashboard = () => {
    const { animals, loading: animalsLoading, error: animalsError } = useAnimals();
    const { todos, loading: todosLoading, error: todosError } = useTodos(animals);
    const { user } = AuthStore;

    // Fucked bug kus useTodos kutsutakse esimesel renderil mingi 10 korda ja todosLoading
    // koguaeg flipib ja laseb läbi undefined todos
    return <div className="flex flex-col flex-1">{todos === undefined ? <div></div> : <Todos todos={todos} />}</div>;
};

export default Dashboard;
