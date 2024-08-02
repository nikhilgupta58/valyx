export interface ISubCategory {
  categoryId: string;
  children: Record<string, ISubCategory> | null;
  categoryValue: string;
}

export interface ICategoryRelation {
  relationships: Record<string, ISubCategory>;
}
