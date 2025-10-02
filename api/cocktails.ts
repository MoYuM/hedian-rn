import { PaginatedResponse, PaginationParams } from '../types/api';
import { Cocktail } from '../types/cocktails';
import { post } from '../utils/request';

export type GetCocktailsListResponse = PaginatedResponse<Cocktail>;
export type GetCocktailsListParams = PaginationParams;

/**
 * 获取鸡尾酒列表
 */
export const getCocktailsList = (params: GetCocktailsListParams) => {
  return post<GetCocktailsListResponse>('/v1/cocktails/getList', params);
};

/**
 * 创建自定义配方
 */
export const createCocktail = (data: {
  name: string;
  ingredients: Array<{
    id: number;
    usage: string;
  }>;
  method?: string;
  garnish?: string;
  note?: string;
  image?: string;
  is_public?: boolean;
}): Promise<{ id: number }> => {
  return post<{ id: number }>('/v1/cocktails/create', data);
};

/**
 * 更新自定义配方
 */
export const updateCocktail = (data: {
  id: number;
  name: string;
  ingredients: Array<{
    id: number;
    usage: string;
  }>;
  method?: string;
  garnish?: string;
  note?: string;
  image?: string;
  is_public?: boolean;
}): Promise<{ id: number }> => {
  return post<{ id: number }>('/v1/cocktails/update', data);
};

/**
 * 删除自定义配方
 */
export const deleteCocktail = (data: {
  id: number;
}): Promise<{ id: number }> => {
  return post<{ id: number }>('/v1/cocktails/delete', data);
};
