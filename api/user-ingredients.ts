import { PaginatedResponse, PaginationParams } from '../types/api';
import { Ingredient } from '../types/ingredient';
import { post } from '../utils/request';

/**
 * 获取用户库存材料
 */
export const getUserIngredientsList = (
  params: PaginationParams
): Promise<PaginatedResponse<Ingredient>> => {
  return post<PaginatedResponse<Ingredient>>(
    '/v1/userIngredients/getIngredientsList',
    params
  );
};

/**
 * 添加用户库存材料
 */
export const addUserIngredient = (data: {
  ingredient_id: number;
}): Promise<void> => {
  return post<void>('/v1/userIngredients/addIngredient', data);
};

/**
 * 删除用户库存材料
 */
export const removeIngredient = (data: {
  ingredient_id: number;
}): Promise<void> => {
  return post<void>('/v1/userIngredients/removeIngredient', data);
};
