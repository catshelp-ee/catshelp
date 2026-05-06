import { ArrowRight } from 'lucide-react';
import { AnimalSummary } from '@interfaces/animal-summary.ts';
import { animalsApi } from '@api/animals.service.ts';
import { StatusBadge } from '@components/status-badge.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';
import { useEffect, useState, useMemo } from 'react';
import { IAnimal } from '@catshelp/types/src/index.ts';
import { usersApi } from '@api/users.service.ts';
import { useUser } from '@hooks/use-user.tsx';

interface Props {
    animalSummary: AnimalSummary;
}

export function AnimalCard({ animalSummary }: Props) {
    const { t } = useTranslation();
    const [animal, setAnimal] = useState<IAnimal>();
    const { user, loading: userLoading, error: userError } = useUser();


    useEffect(() => {
        if (userLoading) {
            return;
        }

        let isMounted = true;
        const fetchAnimal = async () => {
            const res = await animalsApi.getAnimal(animalSummary.id);
            console.log(res);
            if (isMounted) setAnimal(res);
        }
        fetchAnimal();
        return () => { isMounted = false; };
    }, [animalSummary, userLoading]);

    // Reactive calculations
    const { ageText, gender, color } = useMemo(() => {
        if (!animal) return { ageText: '', gender: '', color: '' };

        // 1. Calculate Age
        const birthDate = new Date(animal.birthday);
        const today = new Date();
        let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
        months += today.getMonth() - birthDate.getMonth();
        if (today.getDate() < birthDate.getDate()) months--;
        const ageInMonths = Math.max(0, months);

        let ageStr = '';
        if (ageInMonths < 12) {
            ageStr = `${ageInMonths} ${t("monthsOld")}`;
        } else if (ageInMonths < 24) {
            ageStr = `1 ${t("yearOld")}`;
        } else {
            ageStr = `${Math.floor(ageInMonths / 12)} ${t("yearsOld")}`;
        }

        // 2. Extract Characteristics
        let gen = "";
        let col = "";
        animal.animalCharacteristics?.forEach(char => {
            if (char.type === "GENDER") gen = char.value;
            if (char.type === "COLOR") col = char.value;
        });

        return { ageText: ageStr, gender: gen, color: col };
    }, [animal, t]);

    // Safety check: Show a skeleton or nothing if data is still loading
    if (!animal) {
        return <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />;
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all flex flex-col">
            <div className="aspect-[4/3] bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center">
                <img className="text-7xl" src={animalSummary.pathToProfilePicture} alt='🐱' />
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg text-gray-900">{animal.name}</h3>
                        {
                            animal.status !== null &&
                            (<StatusBadge status={animal.status} size="sm" />)
                        }
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                        {ageText}{gender ? ` • t(gender)` : ''}{color ? ` • t(color)` : ''}
                    </p>
                </div>

                <a href={`/cat-profiles?cat=${animal.id}`} className="flex items-center gap-2 w-full px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 mt-3">
                    {t("openProfile")}
                    <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}