export interface AnimalTodo {
    label: string;
    assignee: string;
    due: string;
    catColour: string;
    urgent: boolean;
    action: {
        label: string;
        redirect?: string;
    };
}