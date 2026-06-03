import { useAnimals } from '@hooks/use-animals.tsx';
import { useTodos } from '@hooks/use-todos.tsx';
import { useUser } from '@hooks/use-user.tsx';
import React from 'react';

import Todos from './todos.tsx';

const Dashboard = () => {
    const { animals, loading: animalsLoading, error: animalsError } = useAnimals();
    const { todos, loading: todosLoading, error: todosError } = useTodos(animals);

    const { user, loading: userLoading, error: userError } = useUser();

    const isLoading = userLoading || animalsLoading || todosLoading;
    const error = userError || animalsError || todosError;

    // Fucked bug kus useTodos kutsutakse esimesel renderil mingi 10 korda ja todosLoading
    // koguaeg flipib ja laseb läbi undefined todos
    return <div className="flex flex-col flex-1">{todos === undefined ? <div></div> : <Todos todos={todos} />}</div>;
};

export default Dashboard;
