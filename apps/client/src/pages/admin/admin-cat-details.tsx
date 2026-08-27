import { Profile } from '@interfaces/profile.ts';
import CatDetails from '@pages/profile/cat-details.tsx';
import React from 'react';


const AdminCatDetails: React.FC<{
    selectedCat: Profile,
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile | null>>
}> = ({ selectedCat, setSelectedCat }) => {
    return (
        <>
            {selectedCat && <CatDetails selectedCat={selectedCat} setSelectedCat={setSelectedCat} />}
        </>
    );
};

export default AdminCatDetails;
