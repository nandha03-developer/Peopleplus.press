import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Link from "next/link";
import Fade from '@mui/material/Fade';
import { useLanguage } from "@/context/languageContext";

export default function FloatingActionButtons({onClick}: any) {
  const [showButton, setShowButton] = React.useState(false);
  const { langCode } = useLanguage();

  // Scroll detection to show/hide button
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1400) { // Show button after scrolling 1400px
        setShowButton(true);
      } else if (window.scrollY <= 2000) { // Hide button near top
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Fade in={showButton}>
      <Box
        sx={{
          position: 'fixed',
          top: '50%', // Center vertically
          left: '40%', // Center horizontally
          zIndex: 9999, // High z-index to appear above other elements
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out', // Smooth transition for scale and opacity
          opacity: showButton ? 1 : 0, // Control opacity based on state
          transform: showButton ? 'translate(-50%, -50%) ' : 'translate(-50%, -50%)', // Scale effect
        }}
      >
        <div onClick={onClick}>
          <Fab
            component="a" // Use "a" tag for accessibility when linking
            variant="extended"
            size="medium"
            sx={{
              bgcolor: '#eb0254',
              color: 'white',
              '&:hover': { bgcolor: '#f52f74', color: 'white' },
              marginTop: '-15px',
              padding: '6px 10px', // Adjust padding for width
              display: 'flex', // Ensure flex layout for alignment
              alignItems: 'center', // Center items vertically
              justifyContent: 'center', // Center items horizontally
            }}
          >
            <KeyboardDoubleArrowRightIcon style={{fontSize:'25px'}} />
            Next News
          </Fab>
        </div>

      </Box>
    </Fade>
  );
}
