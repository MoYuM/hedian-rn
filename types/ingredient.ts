export interface Ingredient {
  en_name: string;
  description: string;
  id: number;
  name: string;
  /** 用量 */
  usage: string;
  /** 材料图片 */
  image?: string;
}
