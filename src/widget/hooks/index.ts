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

export const useFetch = <T>(...params: Parameters<typeof fetch>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(params[0], {
                    ...params[1],
                    signal: controller.signal,
                });

                setData(await res.json());
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    return { data, loading, error };
};
