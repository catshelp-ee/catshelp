import React from "react";
import TodoItem from "./todo-item";
import {AnimalTodo} from "@interfaces/animal-todo";

interface TodoListProps {
    todos: AnimalTodo[];
}

const TodoList: React.FC<TodoListProps> = ({todos}) => {
    return (
        <div className="p-2 md:p-4 border border-solid border-black border-opacity-20 border-slate-500 rounded-2xl">
            <h2 className="dashboard-heading">SINU TEGEMISTE MEELESPEA</h2>

            <div className="flex flex-col gap-6 mt-6">
                {todos.map((item, index) => {
                    return <TodoItem key={index} {...item} />;
                })}
            </div>
        </div>
    );
};

export default TodoList;
