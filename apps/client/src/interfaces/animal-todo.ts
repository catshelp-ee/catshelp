export interface AnimalTodos {
    today: AnimalTodo[];
    soon: AnimalTodo[];
    later: AnimalTodo[];
    completed: AnimalTodo[];
}

export interface AnimalTodo {
    id: number;
    animal_id: number;
    message: string;
    assignee: string;
    due_date: string;
    completed_date: string;
    action_label: string;
    action_redirect: string;
}
