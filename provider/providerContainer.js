import React from 'react';
import { ThemeProvider } from 'next-themes';
import ThemeDataProvider from '@/context/ThemeDataProvider';
import NProgressProvider from './NProgressProvider';

export default function ProviderContainer({ children }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <ThemeDataProvider>
                <NProgressProvider>{children}</NProgressProvider>
            </ThemeDataProvider>
        </ThemeProvider>
    );
}
