import { useTranslation } from '@hooks/use-translation.tsx';
import { AnimalCard } from './animal-card.tsx';
import { useEffect, useState } from 'react';
import AuthStore from '@stores/AuthStore.ts';
import { AnimalSummary } from '@interfaces/animal-summary.ts';
import { useAlert } from '@context/alert-context.tsx';
import { usersApi } from '@api/users.service.ts';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = AuthStore;
    const [animals, setAnimals] = useState<AnimalSummary[]>([]);
    const { showAlert } = useAlert();

    useEffect(() => {
        // Don't fetch if user isn't loaded yet
        if (!user) {
            return;
        }

        const fetchAnimals = async () => {

            try {
                const animalSummaries = await usersApi.getUserAnimals(user.id);
                setAnimals(animalSummaries);
            } catch (e) {
                console.error('Unexpected error in fetchAnimals:', e);
                showAlert('Error', 'Tekkis probleem kasside laadimisega');
            }
        };

        fetchAnimals();
    }, [user, showAlert]);

    return (
        <div className="">
            <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('myCats')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {animals.map((animal) => (
                        <AnimalCard key={animal.id} animalSummary={animal} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
