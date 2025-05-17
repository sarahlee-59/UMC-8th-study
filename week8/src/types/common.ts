export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

export type CursorBasedResponse<T> = {
    data: T;
    nextCursor: number;
    hasNext: boolean;
};

export enum PAGINATION_ORDER {
    "asc" = "asc",
    "desc" = "desc"
}

export type PaginationDto = {
    cursor?: number; 
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER;
}; 