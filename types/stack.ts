export type StackItem = {
    name: string;
    icon: string;
    featured?: boolean;
};

export type StackCategories = {
    frontend: StackItem[];
    backend: StackItem[];
    database: StackItem[];
    tools: StackItem[];
};
