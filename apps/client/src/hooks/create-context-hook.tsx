// src/utils/createContext.ts
import { Context, useContext } from 'react';

/**
 * Creates a custom hook for a given React context.
 * Throws a helpful error if used outside the provider.
 */
export function createContextHook<T>(context: Context<T | undefined>, name: string) {
    return function useCustomContext(): T {
        const ctx = useContext(context);
        if (!ctx) {
            throw new Error(`${name} must be used within its Provider`);
        }
        return ctx;
    };
}
