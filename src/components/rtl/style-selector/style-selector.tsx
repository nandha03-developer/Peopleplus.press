"use client";
import { useTheme } from 'next-themes';
import React, { useState, useEffect } from 'react';

const StyleSelectors: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleThemeChange = (selectedTheme: string) => {
        setTheme(selectedTheme);
    };

    if (!mounted) {
        return null;
    }

    return (
        <div>
            
        </div>
            );
};

export default StyleSelectors;
