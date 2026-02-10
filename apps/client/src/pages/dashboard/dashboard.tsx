import React from "react";
import FosterPets from "./foster-pets";
import TodoList from "./todo-list";
import { useAnimals } from "@hooks/use-animals";
import { useTodos } from "@hooks/use-todos";
import { useUser } from "@hooks/use-user";
import { LoadingWrapper } from "@components/loading";

const Dashboard = () => {
    const { animals, loading: animalsLoading, error: animalsError } = useAnimals();
    const { todos, loading: todosLoading, error: todosError } = useTodos(animals);
    const { user, loading: userLoading, error: userError } = useUser();

    const isLoading = userLoading || animalsLoading || todosLoading;
    const error = userError || animalsError || todosError;

    return (
        <div className="md:mx-12 flex flex-col flex-1">
            <LoadingWrapper loading={isLoading} error={error}>
                <div className="flex flex-col md:m-0">
                    <div className="mx-auto sm:mx-0">
                        <h1 className="font-medium text-4xl my-6">
                            Tere tulemast <span className="block sm:inline">{user?.fullName}! 😺</span>
                        </h1>
                        <FosterPets pets={animals} />
                    </div>
                    <TodoList todos={todos} />
                </div>
            </LoadingWrapper>
        </div>
    );
};

export default Dashboard;