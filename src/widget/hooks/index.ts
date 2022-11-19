import { useEffect, useState } from 'react';
import type { SetStateAction } from 'react';

export const useLocalStorage = <T>(
    key: string,
    initial: T
): [T, (action: SetStateAction<T>) => void] => {
    const [value, setValue] = useState(() => {
        const data = localStorage.getItem(key);

        return data ? JSON.parse(data) : initial;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
};
