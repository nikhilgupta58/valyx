import { ICategoryRelation, ISubCategory } from "@/types";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useMemo } from "react";
import {
  CHECKED_COLOR,
  PARTIALLY_CHECKED_COLOR,
  UNCHECKED_COLOR,
} from "../constant";
import { filterCategoryRelation } from "../hooks/usefilterCategory";
import CustomCheckbox from "./Checkbox";

interface IProps {
  categoriesMap: Record<string, string>;
  categoryRelation: ICategoryRelation;
  onChange: (_: string[]) => void;
  selectedCategories: string[];
  defaultSelectedCategories: string[];
}

const getAllChildrenIds = (subCategory: ISubCategory): string[] => {
  if (!subCategory.children) {
    return [];
  }
  const childIds: string[] = Object.keys(subCategory.children).reduce<string[]>(
    (acc, key) => {
      if (!subCategory.children) return [];
      const child = subCategory.children[key];
      return [...acc, child.categoryId, ...getAllChildrenIds(child)];
    },
    []
  );
  return childIds;
};

export default function SelectedCategoryDropdown({
  categoriesMap,
  categoryRelation,
  selectedCategories,
  onChange,
  defaultSelectedCategories,
}: IProps) {
  const filteredCategory = filterCategoryRelation(
    categoryRelation,
    categoriesMap
  );

  const isChecked = (categoryId: string) =>
    selectedCategories.includes(categoryId);

  const handleChange = (subCategoryArray: ISubCategory[]) => {
    const updatedSelectedCategories = new Set(selectedCategories);

    subCategoryArray.forEach((subCategory) => {
      const categoryId = subCategory.categoryId;
      const allChildIds = getAllChildrenIds(subCategory);

      if (updatedSelectedCategories.has(categoryId)) {
        [categoryId, ...allChildIds].forEach((id) =>
          updatedSelectedCategories.delete(id)
        );
      } else {
        [categoryId, ...allChildIds].forEach((id) =>
          updatedSelectedCategories.add(id)
        );
      }
    });
    onChange(Array.from(updatedSelectedCategories));
  };

  const useCheckStatus = (subCategory: ISubCategory) => {
    return useMemo(() => {
      const checkStatusRecursive = (
        category: ISubCategory
      ): { isFullyChecked: boolean; isPartiallyChecked: boolean } => {
        if (!category.children) {
          return {
            isFullyChecked: isChecked(category.categoryId),
            isPartiallyChecked: false,
          };
        }

        const statuses = Object.values(category.children).map(
          checkStatusRecursive
        );

        const isFullyChecked = statuses.every(
          (status) => status.isFullyChecked
        );
        const isPartiallyChecked = statuses.some(
          (status) => status.isFullyChecked || status.isPartiallyChecked
        );

        return { isFullyChecked, isPartiallyChecked };
      };

      return checkStatusRecursive(subCategory);
    }, [selectedCategories]);
  };

  useEffect(() => {
    const selectedCategorySet = new Set(defaultSelectedCategories);
    const subCats: ISubCategory[] = [];
    const traverseCategories = (
      subCategories: Record<string, ISubCategory>
    ) => {
      Object.values(subCategories).forEach((subCategory) => {
        if (selectedCategorySet.has(subCategory.categoryId)) {
          subCats.push(subCategory);
        }
        if (subCategory.children) {
          traverseCategories(subCategory.children);
        }
      });
      handleChange(subCats);
    };

    traverseCategories(filteredCategory.relationships);
  }, []);

  const renderSubCategory = (categoryId: string, subCategory: ISubCategory) => {
    const checkStatus = useCheckStatus(subCategory);
    const checkboxState = checkStatus.isFullyChecked
      ? CHECKED_COLOR
      : checkStatus.isPartiallyChecked
      ? PARTIALLY_CHECKED_COLOR
      : UNCHECKED_COLOR;

    return (
      <div key={subCategory.categoryId} className="flex flex-col gap-[2px]">
        <CustomCheckbox
          label={subCategory.categoryValue}
          isChecked={isChecked(categoryId)}
          setIsChecked={() => {
            handleChange([subCategory]);
          }}
          color={checkboxState}
        />
        {subCategory.children && (
          <div className="pl-[16px] flex flex-col gap-[2px]">
            {Object.entries(subCategory.children).map(
              ([childCategoryId, childSubCategory]) =>
                renderSubCategory(childCategoryId, childSubCategory)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left w-[234px]">
      <div>
        <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-normal text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <p className="truncate w-[80%] text-left">Select Categories</p>
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 h-5 w-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute left-[50%] translate-x-[-50%] max-h-[400px] w-[312px] overflow-y-auto z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="px-1 py-2 flex flex-col gap-[2px]">
          {Object.entries(filteredCategory.relationships).map(
            ([categoryId, subCategory]) => {
              return renderSubCategory(categoryId, subCategory);
            }
          )}
        </div>
      </MenuItems>
    </Menu>
  );
}
