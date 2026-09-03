import React, {  useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '@context/is-mobile-context.tsx';
import { animalsApi } from '@api/animals.service.ts';
import { Profile } from '@interfaces/profile.ts';
import { useAlert } from '@context/alert-context.tsx';
import AdminCatDetails from './admin-cat-details.tsx';

const AdminCatProfile: React.FC = () => {
    const { showAlert } = useAlert();
    const [selectedCat, setSelectedCat] = useState<Profile | null>(null);
    const isMobile = useIsMobile();
    const params = useParams();

    // Listen for browser back/forward navigation
    useEffect(() => {
        const loadCat = async () => {
            try {
                const catProfile = await animalsApi.getAnimal(parseInt(params.id ?? ''));
                setSelectedCat(catProfile);
            } catch (error) {
                console.error('Error loading cat profiles:', error);
                showAlert('Error', 'Kassi andmete pärimine ebaõnnestus');
                setSelectedCat(null);
            }
        };

        loadCat();
    }, [params]);


    return (
        <div className={`flex flex-col flex-1`}>
            <div className={`flex flex-col ${isMobile ? 'items-center' : ''}`}>
                {selectedCat && <AdminCatDetails selectedCat={selectedCat} setSelectedCat={setSelectedCat} />}
            </div>
        </div>
    );
};

export default AdminCatProfile;
