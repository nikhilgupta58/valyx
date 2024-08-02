export interface ISubCategory {
  categoryId: string;
  children: Record<string, ISubCategory> | null;
  categoryValue: string;
}

export interface ICategoryRelation {
  relationships: Record<string, ISubCategory>;
}

export function filterCategoryRelation(
  categoryRelation: ICategoryRelation,
  categoryMap: Record<string, string>
): ICategoryRelation {
  const filterSubCategories = (
    subCategories: Record<string, ISubCategory>
  ): Record<string, ISubCategory> => {
    const result: Record<string, ISubCategory> = {};

    for (const [key, subCategory] of Object.entries(subCategories)) {
      const categoryIdValue = categoryMap[subCategory.categoryId];

      // Check if categoryIdValue has the suffix "_diffnode"
      if (categoryIdValue && !categoryIdValue.endsWith("_diffnode")) {
        // Recursively filter children if they exist
        const filteredChildren = subCategory.children
          ? filterSubCategories(subCategory.children)
          : null;

        // Add the subcategory to the result if it passes the filter
        result[key] = {
          ...subCategory,
          children: filteredChildren,
        };
      }
    }

    return result;
  };

  const filteredRelationships = filterSubCategories(
    categoryRelation.relationships
  );

  return { relationships: filteredRelationships };
}
