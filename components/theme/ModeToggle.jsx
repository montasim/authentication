'use client';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from 'next-themes';

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            className="relative overflow-hidden rounded-full bg-accent transition-colors duration-300 ease-in-out"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            <span className="flex items-center justify-center transition-transform duration-300 ease-in-out transform translate-x-0 dark:-translate-x-full">
                <HiSun className="h-6 w-6 text-yellow-500" />
            </span>
            <span className="flex items-center justify-center absolute inset-0 transition-transform duration-300 ease-in-out transform translate-x-full dark:translate-x-0">
                <HiMoon className="h-6 w-6 text-blue-500" />
            </span>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
