import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Category } from '../../types/menu';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={selectedCategory}
        onChange={(_, value) => onCategoryChange(value as string)} // Changed here
        variant="scrollable"
        scrollButtons="auto"
        aria-label="categorias de produtos"
      >
        {categories.map((category) => (
          <Tab
            key={category.id}
            value={category.name} // Changed here
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* <span>{category.icon}</span>  Removed because category.icon does not exist */}
                <span>{category.name}</span>
              </Box>
            }
            sx={{
              '&.Mui-selected': {
                //color: category.color, Removed because category.color does not exist
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
