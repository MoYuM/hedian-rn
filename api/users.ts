import { post } from '../utils/request';

export type GetUserInfoResponse = { username: string };

/**
 * 获取用户信息
 */
export const getUserInfo = (): Promise<GetUserInfoResponse> => {
  return post<GetUserInfoResponse>('/v1/users/info');
};
