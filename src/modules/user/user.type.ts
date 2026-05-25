import { PaginatedResult, PaginationQuery } from '@/common/utils/paginator';

export interface UserListData {
  id: number;
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
  };
}

export type UserListResponse = PaginatedResult<UserListData>;

export type UserQuery = PaginationQuery;
