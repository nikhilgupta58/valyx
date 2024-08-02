import { useState } from "react";
import SelectedCategoryDropdown from "./components/SelectedCategoryDropdown";
import category_relation from "./data/category-relation.json";
import id_to_name from "./data/id-to-name-map.json";

const defaultSelectedCategories: string[] = [
  "cat_5de0393d7b",
  "cat_b6e08a0ad1",
];

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="w-full flex justify-center p-4">
      <SelectedCategoryDropdown
        defaultSelectedCategories={defaultSelectedCategories}
        selectedCategories={selectedCategories}
        onChange={setSelectedCategories}
        categoriesMap={id_to_name}
        categoryRelation={category_relation}
      />
    </div>
  );
}
