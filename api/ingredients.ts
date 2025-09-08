import { PaginatedResponse } from '../types/api'
import { Ingredient } from '../types/ingredient'
import { post } from '../utils/request'

/**
 * 搜索材料
 */
export const searchIngredient = (params: { keyword?: string }): Promise<PaginatedResponse<Ingredient>> => {
  return post<PaginatedResponse<Ingredient>>('/v1/ingredients/search', params)
}
