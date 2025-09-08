import { PaginatedResponse, PaginationParams } from '../types/api'
import { Cocktail } from '../types/cocktails'
import { post } from '../utils/request'

/**
 * 添加鸡尾酒到收藏
 */
export const addCocktail = (data: { cocktailId: number }): Promise<void> => {
  return post<void>('/v1/userCocktails/addCocktail', data)
}

/**
 * 从收藏中删除鸡尾酒
 */
export const removeCocktail = (data: { cocktailId: number }): Promise<void> => {
  return post<void>('/v1/userCocktails/removeCocktail', data)
}

/**
 * 获取用户收藏的鸡尾酒列表
 */
export const getUserCocktailsList = (params: PaginationParams & { is_makeable?: boolean }): Promise<PaginatedResponse<Cocktail>> => {
  return post<PaginatedResponse<Cocktail>>('/v1/userCocktails/getCocktailList', params)
}
