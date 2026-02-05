import { useEffect, useState } from 'react';
import {AnimalSummary} from "@interfaces/animal-summary";
import {usersApi} from "@api/users.service";
import {useUser} from "@hooks/use-user";
import {useAlert} from "@context/alert-context";

export function useAnimals() {
    const [animals, setAnimals] = useState<AnimalSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { showAlert } = useAlert();

    const {user, loading: userLoading, error: userError} = useUser();

    useEffect(() => {
        // Don't fetch if user isn't loaded yet
        if (userLoading || userError || !user) {
            return;
        }

        let isMounted = true;

        const fetchAnimals = async () => {
            setLoading(true);
            setError(null);

            try {
                const animalSummaries = await usersApi.getUserAnimals(user.id);

                if (isMounted) {
                    setAnimals(animalSummaries);
                }
            } catch (e) {
                if (isMounted) {
                    setError(e as Error);
                    showAlert('Error', "Tekkis probleem kasside laadimisega");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAnimals().catch((e) => {
            console.error('Unexpected error in fetchAnimals:', e);
        });

        return () => {
            isMounted = false;
        };
    }, [user, userLoading, userError, showAlert]);

    return {
        animals,
        loading: userLoading || loading,
        error: userError || error
    };
}