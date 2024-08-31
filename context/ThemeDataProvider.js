'use client';

import setGlobalColorTheme from '@/lib/themeColors';
import { useTheme } from 'next-themes';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({});

export default function ThemeDataProvider({ children }) {
    const getSavedThemeColor = () => {
        try {
            return localStorage.getItem('themeColor') || 'Zinc';
        } catch (error) {
            return 'Zinc';
        }
    };

    const [themeColor, setThemeColor] = useState(getSavedThemeColor());
    const [isMounted, setIsMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        localStorage.setItem('themeColor', themeColor);
        setGlobalColorTheme(theme, themeColor);

        if (!isMounted) {
            setIsMounted(true);
        }
    }, [themeColor, theme]);

    if (!isMounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}
