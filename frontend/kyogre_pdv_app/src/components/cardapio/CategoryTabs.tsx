import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Category } from '../../types/menu';


//! Ainda tentando pegar e refazer um app inteiro com a tabs correta e bonititinah pela cor

// cinza escuro: #696969
// cinza médio: #C0C0C0
// cinza claro: #d3d3d3
// azul: #0000ff
// vermelho: #ff0000



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
    <Box sx={{ backgroundColor: '#B0C4DE', padding: 2, borderRadius: 5 }}>
      <Tabs
        value={selectedCategory}
        onChange={(_, value) => onCategoryChange(value as string)} // Changed here
        variant="scrollable"
        scrollButtons="auto"
        aria-label="categorias de produtos"
        color='secondary'
        textColor='secondary'
      >
        {categories.map((category) => (
          <Tab
            key={category.id}
            value={category.name} // Changed here
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <h1 style={{ fontSize: '1.2rem' }}>{category.name}</h1> 
              </Box>
            }
            sx={{
              '&.Mui-selected': {
                color: '#0000FF',
                backgroundColor: '#FFFFE0',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#D3D3D3',
                },
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
