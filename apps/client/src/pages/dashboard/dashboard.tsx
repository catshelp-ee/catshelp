import React from "react";
import { useAnimals } from "@hooks/use-animals.tsx";
import { useTodos } from "@hooks/use-todos.tsx";
import { useUser } from "@hooks/use-user.tsx";


const Dashboard = () => {
    const { animals, loading: animalsLoading, error: animalsError } = useAnimals();
    const { todos, loading: todosLoading, error: todosError } = useTodos(animals);
    const { user, loading: userLoading, error: userError } = useUser();

    const isLoading = userLoading || animalsLoading || todosLoading;
    const error = userError || animalsError || todosError;

    return (
        <div className="">
        </div>
    );
};

export default Dashboard;