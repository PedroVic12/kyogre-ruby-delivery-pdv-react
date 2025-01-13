import * as React from "react";
import { Box } from "@mui/material";

const ScrollArea = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Box>>(
  ({ className, children, ...props }, ref) => (
    <Box
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      {...props}
      sx={{ overflowY: 'auto', height: '100%', width: '100%' }} // Ensure it scrolls
    >
      {children}
    </Box>
  )
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };