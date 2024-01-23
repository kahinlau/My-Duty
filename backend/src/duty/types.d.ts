export type Duty = {
    id: string;
    name: string;
};

export type QueryError <E> = {
    name: E,
    description: string
};

export type QueryData <D> = {
    data: D
};

export type Result<D, E> =  QueryData<D> | QueryError<E>;

export type ErrorResponse = {
    error: string;
};

export type DataResponse<T> = {
    data: T;
};