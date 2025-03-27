import { createContext, PropsWithChildren, useContext, useState } from 'react';

export enum THEME {
    LIGHT = 'light',
    DARK = 'dark', 
}

interface IThemeContext {
    theme: THEME.LIGHT | THEME.DARK;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<THEME.LIGHT | THEME.DARK>(THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prevTheme) => 
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
        );
    };
    
    return  (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );

};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}