import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Card, CardMedia, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types/menu'; // Import Product type



interface FeaturedCarouselProps {
  items: Product[]; // Changed to Product[]
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (!isPaused) {
      intervalId = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isPaused, nextSlide]);

  return (
    <Box
      sx={{
        position: 'relative',
        mb: 4,
        height: { xs: '150px', sm: '200px' },
        overflow: 'hidden'
      }}
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
              borderRadius: { xs: '8px', sm: '16px' },
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <CardMedia
              component="img"
              height={isMobile ? "100" : "200"}
              image={item.imageUrl || ""} // Use url_imagem and provide a default empty string
              alt={item.name}
              sx={{
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: { xs: 'none', sm: 'scale(1.05)' },
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
                p: { xs: 1, sm: 2 },
              }}
            >
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  fontSize: { xs: '1.2rem', sm: '1.55rem' },
                  lineHeight: { xs: '1.2', sm: '1.5' }
                }}
              >
                {item.name}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1.4rem' },
                  lineHeight: { xs: '1.2', sm: '1.5rem' }
                }}
              >
                R$ {item.price.toFixed(2)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
      {!isMobile && (
        <>
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
              display: { xs: 'none', sm: 'flex' }
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
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}
    </Box>
  );
};
