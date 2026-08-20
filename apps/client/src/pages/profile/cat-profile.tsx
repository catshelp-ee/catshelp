import type { Profile } from '@interfaces/profile.ts';
import { useAlert } from '@context/alert-context.tsx';
import { useIsMobile } from '@context/is-mobile-context.tsx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import CatDetails from './cat-details.tsx';
import ProfileTabs from './profile-tabs.tsx';
import AuthStore from '@stores/AuthStore.ts';
import { usersApi } from '@api/users.service.ts';
import { AnimalSummary } from '@interfaces/animal-summary.ts';

const CatProfile: React.FC = () => {
    const { showAlert } = useAlert();
    const [cats, setCats] = useState<AnimalSummary[]>([]);
    const [selectedCat, setSelectedCat] = useState<Profile | null>(null);
    const isMobile = useIsMobile();
    const { user } = AuthStore;

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadUserCats = async () => {
            try {
                const response = await usersApi.getUserAnimals(user.id);
                setCats(response);
            } catch (error) {
                console.error('Error loading cat profiles:', error);
                showAlert('Error', 'Kassi andmete pärimine ebaõnnestus');
                setCats([]);
            }
        };

        loadUserCats();
    }, [user, showAlert]);

    return (
        <div className={`flex flex-col flex-1`}>
            <div className={`flex flex-col ${isMobile ? 'items-center' : ''}`}>
                {cats.length !== 0 && (
                    <>
                        <ProfileTabs cats={cats} setSelectedCat={setSelectedCat} />
                        {selectedCat && <CatDetails selectedCat={selectedCat} setSelectedCat={setSelectedCat} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default observer(CatProfile);
