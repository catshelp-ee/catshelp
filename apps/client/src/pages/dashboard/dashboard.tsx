import { useAnimals } from '@hooks/use-animals.tsx';
import { useTodos } from '@hooks/use-todos.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';

import { AnimalCard } from './animal-card.tsx';

const Dashboard = () => {
    const { t } = useTranslation();
    const { animals, loading: animalsLoading, error: animalsError } = useAnimals();
    /*const { animals, loading: animalsLoading, error: animalsError } = useAnimals();
    const { todos, loading: todosLoading, error: todosError } = useTodos(animals);
    const { user } = AuthStore;
    */

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
