import { usersApi } from '@api/users.service.ts';
import { useAlert } from '@context/alert-context.tsx';
import type { AnimalSummary } from '@interfaces/animal-summary.ts';
import AuthStore from '@stores/AuthStore.ts';
import { useEffect, useState } from 'react';

export function useAnimals() {
    const [animals, setAnimals] = useState<AnimalSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { showAlert } = useAlert();

    const { user } = AuthStore;

    useEffect(() => {
        // Don't fetch if user isn't loaded yet
        if (!user) {
            return;
        }

        // Prevent state updates after component unmounts
        // Example: User navigates away at 100ms, API returns at 500ms
        // Without this check, setAnimals() would run on unmounted component → warning/error

        const fetchAnimals = async () => {
            setLoading(true);
            setError(null);

            try {
                const animalSummaries = await usersApi.getUserAnimals(user.id);

                setAnimals(animalSummaries);
            } catch (e) {
                setError(e as Error);
                showAlert('Error', 'Tekkis probleem kasside laadimisega');
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals().catch((e) => {
            console.error('Unexpected error in fetchAnimals:', e);
        });
    }, [user, showAlert]);

    return {
        animals,
        loading: loading,
        error: error,
    };
}
