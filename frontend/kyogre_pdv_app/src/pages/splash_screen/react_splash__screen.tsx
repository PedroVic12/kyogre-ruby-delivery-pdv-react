import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Landmark,
  Edit,
  Bike,
  Settings,
  Wifi,
  Utensils,
  Ship,
  Ban,
  Table,
  CheckCircle, // Icon for completion message
} from 'lucide-react'; // Using lucide-react for icons

// Define the props for the component (if any were needed)
interface SplashScreenProps {
  // Example: logoUrl?: string;
  redirectUrl?: string; // Make redirect URL configurable
}

// The main SplashScreen component
const SplashScreen: React.FC<SplashScreenProps> = ({
  redirectUrl = 'https://kyogre-ruby-delivery-pdv-react.vercel.app/cardapio', // Default redirect URL
}) => {
  // State variables to control the animation phases and loading status
  const [showIcons, setShowIcons] = useState(false);
  const [animateLogo, setAnimateLogo] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // --- Effects for Animation Sequencing ---

  // Effect 1: Trigger initial animations on component mount
  useEffect(() => {
    // Show icons shortly after mount
    const iconsTimer = setTimeout(() => {
      setShowIcons(true);
    }, 100); // Small delay before icons appear

    // Start logo animation slightly later
    const logoTimer = setTimeout(() => {
      setAnimateLogo(true);
    }, 300); // Delay before logo starts animating

    return () => {
      clearTimeout(iconsTimer);
      clearTimeout(logoTimer);
    };
  }, []);

  // Effect 2: Simulate data loading and handle completion
  // This triggers when the logo animation starts
  useEffect(() => {
    if (animateLogo) {
      // Simulate data loading duration (adjust as needed)
      // Corresponds to the logo animation duration + potential loading time
      const loadingTimer = setTimeout(() => {
        setLoadingComplete(true);
      }, 2500); // Simulate loading time (e.g., 2.5 seconds)

      return () => clearTimeout(loadingTimer);
    }
  }, [animateLogo]);

  // Effect 3: Show completion message and schedule redirection
  // This triggers when loading is marked as complete
  useEffect(() => {
    if (loadingComplete) {
      // Show the "Dados Carregados" message
      setShowCompletionMessage(true);

      // Wait for a bit after showing the message, then redirect
      const redirectTimer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000); // Wait 2 seconds after message appears

      return () => clearTimeout(redirectTimer);
    }
  }, [loadingComplete, redirectUrl]);

  // --- Animation Variants ---

  // Variants for the icon column fade-in
  const iconContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5, // Slower fade-in like the original 5000ms
        when: 'beforeChildren', // Ensure container fades in first
        staggerChildren: 0.1, // Stagger icon appearance
      },
    },
  };

  // Variants for individual icons
  const iconVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Variants for the logo card animation (slide up and fade in)
  const logoCardVariants = {
    initial: { opacity: 0, y: 100 }, // Start off-screen and invisible
    animate: {
      opacity: 1,
      y: 0, // Animate to final position
      transition: {
        duration: 2.0, // Duration similar to original 7000ms (adjust as needed)
        ease: [0.42, 0, 0.58, 1], // ease: Curves.fastLinearToSlowEaseIn equivalent
      },
    },
  };

  // Variants for the completion message
  const completionMessageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // --- Render Logic ---
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-indigo-600 font-sans">
      {/* 1. Icon Column (Animated) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center space-y-2"
        variants={iconContainerVariants}
        initial="hidden"
        animate={showIcons ? 'visible' : 'hidden'}
      >
        {/* Render icons using lucide-react */}
        {[
          Clock,
          Landmark,
          Edit,
          Bike,
          Settings,
          Wifi,
          Utensils,
          Ship,
          Ban,
          Table,
        ].map((IconComponent, index) => (
          <motion.div key={index} variants={iconVariants}>
            <IconComponent size={36} color="white" />
          </motion.div>
        ))}
      </motion.div>

      {/* 2. Logo Card (Animated) */}
      <motion.div
        variants={logoCardVariants}
        initial="initial"
        animate={animateLogo ? 'animate' : 'initial'}
        className="z-10" // Ensure logo is above icons if they overlap
      >
        <div className="flex h-64 w-64 items-center justify-center rounded-[32px] bg-indigo-800 p-8 shadow-xl">
          {/* Placeholder for the logo - replace with your actual logo */}
          <img
            src="https://placehold.co/200x200/FFFFFF/4F46E5?text=Logo" // Using a placeholder
            alt="Company Logo"
            className="h-full w-full object-contain"
            onError={(e) => {
              // Fallback if the image fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=Logo+Error';
              target.alt = 'Logo loading error';
            }}
          />
        </div>
      </motion.div>

      {/* 3. Completion Message (Appears after loading) */}
      <AnimatePresence>
        {showCompletionMessage && (
          <motion.div
            className="absolute bottom-10 z-20 flex flex-col items-center text-white"
            variants={completionMessageVariants}
            initial="hidden"
            animate="visible"
            exit="hidden" // Optional: define exit animation if needed
          >
            <CheckCircle size={48} className="mb-2" />
            <p className="text-2xl font-semibold">Seja bem vindo(a) a nova era digital!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export the component as default for use in Vite/React projects
export default SplashScreen;

