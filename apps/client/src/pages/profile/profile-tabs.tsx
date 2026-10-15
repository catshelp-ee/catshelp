import type { Profile } from '@interfaces/profile.ts';
import { useAlert } from '@context/alert-context.tsx';
import React, { useState, useEffect } from 'react';
import { AnimalSummary } from '@interfaces/animal-summary.ts';
import { animalsApi } from '@api/animals.service.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/select.tsx';
import { Check } from 'lucide-react';

interface TabProps {
    cats: AnimalSummary[];
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const ProfileTab: React.FC<TabProps> = ({ cats, setSelectedCat }) => {
    const getTabFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('cat');
        for (let i = 0; i < cats.length; i++) {
            if (cats[i].id.toString() == tab) {
                return cats[i].id;
            }
        }
        return cats[0].id;
    };

    const [activeTab, setActiveTab] = useState(getTabFromURL());
    const { showAlert } = useAlert();
    const useTabs = cats.length <= 4;

    const setInitialTab = () => {
        const url = new URL(window.location.toString());
        url.searchParams.set('cat', activeTab.toString());
        window.history.replaceState({}, '', url);
    };

    // Update URL when tab changes
    const handleTabChange = (catId: string) => {
        setActiveTab(Number(catId));
        const url = new URL(window.location.toString());
        url.searchParams.set('cat', catId.toString());
        window.history.pushState({}, '', url);
    };

    // Listen for browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => {
            setActiveTab(getTabFromURL());
        };

        const loadCat = async () => {
            try {
                const catProfile = await animalsApi.getAnimal(activeTab);
                setSelectedCat(catProfile);
            } catch (error) {
                console.error('Error loading cat profiles:', error);
                showAlert('Error', 'Kassi andmete pärimine ebaõnnestus');
                setSelectedCat(null);
            }
        };

        loadCat();
        setInitialTab();
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeTab]);


    if (useTabs) {
        return (
            <div className="border-b border-gray-200 overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    {cats.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleTabChange(cat.id.toString())}
                            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === cat.id
                                ? 'border-blue-600 text-blue-700'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Dropdown for more than 4 cats
    return (
        <div className="border-b border-gray-200 p-4">
            <Select value={activeTab.toString()} onValueChange={handleTabChange}>
                <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {cats.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                            <div className="flex items-center gap-2">
                                <span>{cat.name}</span>
                                {activeTab === cat.id && (
                                    <Check className="w-4 h-4 text-blue-600" />
                                )}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ProfileTab;
