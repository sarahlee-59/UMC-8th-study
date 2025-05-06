import { PAGINATION_ORDER } from "../enums/common";

export type CommonResponse<T> = {
    accessToken(accessToken: any): unknown;
    token(accessToken: string, token: any): unknown;
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

export type CursorBasedResponse<T> = {
    accessToken(accessToken: any): unknown;
    token(accessToken: string, token: any): unknown;
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
    nextCursor: number;
    hasNext: boolean;
};

export type PaginationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER;
};