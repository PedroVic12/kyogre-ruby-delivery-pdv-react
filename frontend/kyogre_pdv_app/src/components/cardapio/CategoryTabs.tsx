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
    <Box sx={{ backgroundColor: '#C0C0C0', padding: 2, borderRadius: 1 }}>
      <Tabs
        value={selectedCategory}
        onChange={(_, value) => onCategoryChange(value as string)} // Changed here
        variant="scrollable"
        scrollButtons="auto"
        aria-label="categorias de produtos"
         color='primary'
        textColor='secondary'
      >
        {categories.map((category) => (
          <Tab
            key={category.id}
            value={category.name} // Changed here
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{category.name}</span>
              </Box>
            }
            sx={{
              '&.Mui-selected': {
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
