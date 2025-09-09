import type { Ingredient } from './ingredient';

export interface Cocktail {
  created_at: string;
  en_ingredients: string;
  name: string;
  en_name: string;
  garnish: string;
  history: string;
  id: number;
  image: string;
  ingredients?: Ingredient[];
  method: string;
  note: string;
  updated_at: string;
  author_id: number;
  author_name: string;
  /** 是否是当前用户 star 的配方 */
  is_star: boolean;
  /** 是否是公开的配方 */
  is_public: boolean;
  /** star 数 */
  star: number;
}
