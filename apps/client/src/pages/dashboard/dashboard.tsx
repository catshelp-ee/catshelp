import { useAnimals } from '@hooks/use-animals.tsx';
import { useTodos } from '@hooks/use-todos.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';
import { useUser } from '@hooks/use-user.tsx';
import type { AnimalSummary } from '@interfaces/animal-summary.ts';
import { MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';

import Todos from './todos.tsx';

const Dashboard = () => {
    const { t } = useTranslation();
    const [selectedAnimalId, setSelectedAnimalId] = useState<number | 'all'>('all');
    const { animals, loading: animalsLoading, error: animalsError } = useAnimals();

    const {
        todos,
        loading: todosLoading,
        error: todosError,
    } = useTodos(selectedAnimalId === 'all' ? animals : [animals.find((a) => a.id === selectedAnimalId)]);
    const { user, loading: userLoading, error: userError } = useUser();

    const isLoading = userLoading || animalsLoading || todosLoading;
    const error = userError || animalsError || todosError;

    // Fucked bug kus useTodos kutsutakse esimesel renderil mingi 10 korda ja todosLoading
    // koguaeg flipib ja laseb läbi undefined todos
    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{t('nextTodos')}</h2>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedAnimalId} onChange={(e) => setSelectedAnimalId(e.target.value)}>
                        <MenuItem value="all">Kõik kassid</MenuItem>
                        {animals.map((a) => (
                            <MenuItem key={a.id} value={a.id}>
                                {a.name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>

            {todos === undefined ? <div></div> : <Todos todos={todos} />}
        </div>
    );
};

export default Dashboard;
