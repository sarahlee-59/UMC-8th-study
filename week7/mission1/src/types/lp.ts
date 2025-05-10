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

export type Lp = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: Likes[];
}

export type LpListResponse = {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
      data: Lp[];           // LP 항목 리스트
      hasNext: boolean;
      nextCursor: number;
    };
  };

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

// 10분 37초