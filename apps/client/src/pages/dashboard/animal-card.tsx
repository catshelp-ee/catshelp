import { StatusBadge } from '@components/StatusBadge.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';
import type { AnimalSummary } from '@interfaces/animal-summary.ts';
import { calculateAge } from '@utils/date-utils.ts';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
    animalSummary: AnimalSummary;
}

export function AnimalCard({ animalSummary }: Props) {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all flex flex-col">
            <div className="aspect-[4/3] bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center">
                {animalSummary.profilePicture && animalSummary.profilePicture.trim() !== '' ?
                    (<img className="text-7xl" src={animalSummary.profilePicture} alt="🐱" />) :
                    (<span className="text-7xl">🐱</span>)
                }
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg text-gray-900">{animalSummary.name}</h3>
                        {animalSummary.status !== '' && animalSummary.status != null && <StatusBadge status={animalSummary.status} size="sm" />}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                        {calculateAge(new Date(animalSummary.birthDate), t)}
                        {animalSummary.gender !== '' && animalSummary.gender != null ? ` • ${t(animalSummary.gender)}` : ''}
                        {animalSummary.coatColor !== '' && animalSummary.coatColor != null ? ` • ${t(animalSummary.coatColor)}` : ''}
                    </p>
                </div>

                <Link
                    to={`/cat-profiles?cat=${animalSummary.id}`}
                    className="w-full px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 mt-3"
                >
                    {t('openProfile')}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
