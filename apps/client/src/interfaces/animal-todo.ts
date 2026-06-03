export interface AnimalTodos {
    today: AnimalTodo[];
    soon: AnimalTodo[];
    later: AnimalTodo[];
    completed: AnimalTodo[];
}

export interface AnimalTodo {
    label: string;
    assignee: string;
    due: string;
    completed: boolean;
    action: {
        label: string;
        redirect?: string;
    };
}
