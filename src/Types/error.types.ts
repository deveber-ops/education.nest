export type ErrorMessage = {
    message: string;
    field?: string | null; // допускаем null
};

export type ErrorResponse = {
    errorsMessages: ErrorMessage[];
};