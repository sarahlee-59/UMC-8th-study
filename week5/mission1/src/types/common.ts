export type CommonResponse<T> = {
    accessToken(accessToken: any): unknown;
    token(accessToken: string, token: any): unknown;
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
}