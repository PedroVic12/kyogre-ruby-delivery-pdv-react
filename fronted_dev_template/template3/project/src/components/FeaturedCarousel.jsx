import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Card, CardMedia, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    let intervalId;
    if (!isPaused) {
      intervalId = setInterval(nextSlide, 5000); // Auto-cycle every 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [isPaused, nextSlide]);

  return (
    <Box 
      sx={{ position: 'relative', mb: 4, height: '200px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          transform: `translateX(-${currentIndex * 100}%)`,
          height: '100%',
        }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            sx={{
              minWidth: '100%',
              flexShrink: 0,
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={item.image}
              alt={item.name}
              sx={{ 
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white',
                p: 2,
              }}
            >
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="subtitle1">
                R$ {item.price.toFixed(2)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          zIndex: 2,
        }}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          zIndex: 2,
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};