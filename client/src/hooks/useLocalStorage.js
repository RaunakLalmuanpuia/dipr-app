import { useState, useEffect } from "react";

const useLocalStorage = (key, initValue) => {
    const [value, setValue] = useState(() => {
        // Get from localStorage on initial mount
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initValue;
        }
    });

    useEffect(() => {
        // Save to localStorage whenever value changes
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;