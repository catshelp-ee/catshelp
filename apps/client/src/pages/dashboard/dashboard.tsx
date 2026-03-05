import React from "react";
import { useAnimals } from "@hooks/use-animals";
import { useTodos } from "@hooks/use-todos";
import { useUser } from "@hooks/use-user";


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