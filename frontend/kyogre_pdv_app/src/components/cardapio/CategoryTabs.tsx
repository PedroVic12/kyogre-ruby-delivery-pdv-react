import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Category } from '../../models/Product';

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
        onChange={(_, value) => onCategoryChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="categorias de produtos"
      >
        {categories.map((category) => (
          <Tab
            key={category.id}
            value={category.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Box>
            }
            sx={{
              '&.Mui-selected': {
                color: category.color,
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};