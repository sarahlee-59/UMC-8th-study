import { ReactNode } from 'react';
import { CursorBasedResponse } from './common.ts';

export type Tag = {
    id: number;
    name: string;
}

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
}

export type ResponseLpListDto = CursorBasedResponse<{
    data: {
        title: ReactNode;
        id: number;
        name: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tag[];
        likes: Likes[];
    }[];
}>;
