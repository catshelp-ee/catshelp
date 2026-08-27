import { useAlert } from '@context/alert-context.tsx';
import { AnimalSummary } from '@interfaces/animal-summary.ts';
import React, { useEffect, useMemo, useState } from 'react';
import { animalsApi } from '@api/animals.service.ts';
import { AlertCircle, Clock, Calendar, Eye } from 'lucide-react';
import { TaskBadge } from '@components/TaskBadge.tsx';
import { FilterPanel } from './filter-panel.tsx';
import { FilterState } from '@interfaces/filter-state.ts';
import { Link } from 'react-router-dom';



const AdminCatList: React.FC = () => {
    const { showAlert } = useAlert();
    const [cats, setCats] = useState<AnimalSummary[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        location: [],
        fosterHome: [],
        gender: [],
        ageGroup: [],
        sterilised: null,
        medicalOngoing: null,
        hasOverdueTasks: null,
        hasDueSoonTasks: null,
        published: null,
        searchQuery: '',
    });

    useEffect(() => {
        const loadCats = async () => {
            try {
                const response = await animalsApi.getAnimals();
                setCats(response);
            } catch (error) {
                console.error('Error loading cat profiles:', error);
                showAlert('Error', 'Kasside andmete pärimine ebaõnnestus');
                setCats([]);
            }
        };

        loadCats();
    }, [showAlert]);

    const getAgeInMonths = (birthDate: string) => {
        if (!birthDate) {
            return 0;
        }
        const now = new Date();
        const birth = new Date(birthDate);
        const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
        return months;
    };

    const filteredAndSortedCats = useMemo(() => {
        let filtered = cats.filter(cat => {
            const ageMonths = getAgeInMonths(cat.birthDate);

            if (filters.location.length > 0 && !filters.location.includes(cat.location)) return false;
            if (filters.fosterHome.length > 0 && !filters.fosterHome.includes(cat.fosterHome)) return false;
            if (filters.gender.length > 0 && !filters.gender.includes(cat.gender)) return false;
            if (filters.ageGroup.length > 0) {
                const isKitten = ageMonths < 12;
                if (filters.ageGroup.includes('kitten') && !isKitten) return false;
                if (filters.ageGroup.includes('adult') && isKitten) return false;
            }
            if (filters.sterilised !== null && cat.sterilised !== filters.sterilised) return false;
            if (filters.medicalOngoing !== null && cat.medicalOngoing !== filters.medicalOngoing) return false;
            if (filters.hasOverdueTasks !== null && (cat.overdueCount > 0) !== filters.hasOverdueTasks) return false;
            if (filters.hasDueSoonTasks !== null && (cat.dueSoonCount > 0) !== filters.hasDueSoonTasks) return false;
            if (filters.published !== null && cat.published !== filters.published) return false;

            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                return (
                    cat.name.toLowerCase().includes(query) ||
                    cat.rescueNumber.toLowerCase().includes(query) ||
                    cat.fosterHome.toLowerCase().includes(query)
                );
            }

            return true;
        });

        /*
        if (sortField) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                if (sortField === 'nearestDueDate') {
                    aValue = getNearestDueDate(a.id);
                    bValue = getNearestDueDate(b.id);
                    if (!aValue) return 1;
                    if (!bValue) return -1;
                } else if (sortField === 'fosterHomeId') {
                    const aHome = fosterHomes.find(fh => fh.id === a.fosterHomeId);
                    const bHome = fosterHomes.find(fh => fh.id === b.fosterHomeId);
                    aValue = aHome?.name || '';
                    bValue = bHome?.name || '';
                } else {
                    aValue = a[sortField];
                    bValue = b[sortField];
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        */

        return filtered;
    }, [cats, filters, /*sortField, sortDirection, tasks*/]);

    const groupedCats = useMemo(() => {
        const overdue: AnimalSummary[] = [];
        const dueSoon: AnimalSummary[] = [];
        const other: AnimalSummary[] = [];

        filteredAndSortedCats.forEach(cat => {
            if (cat.status === 'overdue') {
                overdue.push(cat);
            } else if (cat.status === 'due-soon') {
                dueSoon.push(cat);
            } else {
                other.push(cat);
            }
        });

        return { overdue, dueSoon, other };
    }, [filteredAndSortedCats]);


    const renderCatRow = (cat: AnimalSummary) => {
        const ageMonths = getAgeInMonths(cat.birthDate);

        return (
            <tr key={cat.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center shrink-0">
                            {cat.profilePicture ? (
                                <img src={cat.profilePicture} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-base">🐱</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{cat.rescueNumber}</span>
                            {(['overdue', 'due-soon'].includes(cat.status)) && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                    {cat.status === 'overdue' && (
                                        <TaskBadge status="overdue" count={cat.overdueCount} />
                                    )}
                                    {cat.status === 'due-soon' && (
                                        <TaskBadge status="due-soon" count={cat.dueSoonCount} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </td>
                <td className="px-4 py-4">
                    <span className="text-gray-900">{cat.name}</span>
                </td>
                <td className="px-4 py-4">
                    <span className="text-gray-700">{cat.fosterHome}</span>
                </td>
                <td className="px-4 py-4">
                    <span className="text-gray-700">{cat.location}</span>
                </td>
                <td className="px-4 py-4">
                    <span className="text-gray-700">{cat.gender === 'Male' ? 'Isane' : cat.gender === 'Female' ? 'Emane' : 'Teadmata'}</span>
                </td>
                <td className="px-4 py-4">
                    <div className="flex flex-col">
                        <span className="text-gray-700">{cat.birthDate ? new Date(cat.birthDate).toLocaleDateString('et-EE') : '–'}</span>
                        <span className="text-xs text-gray-500">{ageMonths === 1 ? '1 kuu' : `${ageMonths} kuud`}</span>
                    </div>
                </td>
                <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${cat.sterilised ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {cat.sterilised ? 'Jah' : 'Ei'}
                    </span>
                </td>
                <td className="px-4 py-4 text-center">
                    {
                        cat.complexVaccineDate ? (
                            <span className="text-sm text-gray-700">
                                {new Date(cat.complexVaccineDate).toLocaleDateString('et-EE')}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-400">–</span>
                        )
                    }
                </td>
                <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                        <Link to={`/admin/cat-profile/${cat.id}`}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer" title="Vaata">
                            <Eye className="w-5 h-5" />
                        </Link>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Kasside ülevaade</h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        {filteredAndSortedCats.length} kass{filteredAndSortedCats.length !== 1 ? 'i' : ''}
                        {filters.searchQuery && ` vastab otsingule "${filters.searchQuery}"`}
                    </p>
                </div>
            </div>

            <FilterPanel
                cats={cats}
                filters={filters}
                onFiltersChange={setFilters}
            />

            {/* Mobile Card View TODO*/}


            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {groupedCats.overdue.length > 0 && (
                        <>
                            <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <h3 className="font-semibold text-red-900">
                                        Tähtaja ületanud ({groupedCats.overdue.length})
                                    </h3>
                                </div>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('rescueNumber')}>
                                            Päästenr
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                                            Nimi
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('fosterHomeId')}>
                                            Hoiukodu
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('location')}>
                                            Asukoht
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Sugu
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('birthDate')}>
                                            Sünniaeg
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Steriliseeritud
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Vaktsineeritud
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Tegevused
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedCats.overdue.map(renderCatRow)}
                                </tbody>
                            </table>
                        </>
                    )}

                    {groupedCats.dueSoon.length > 0 && (
                        <>
                            <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-200">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                    <h3 className="font-semibold text-yellow-900">
                                        Tähtaeg läheneb ({groupedCats.dueSoon.length})
                                    </h3>
                                </div>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Päästenr
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Nimi
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Hoiukodu
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Asukoht
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Sugu
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Sünniaeg
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Steriliseeritud
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Vaktsineeritud
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Tegevused
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedCats.dueSoon.map(renderCatRow)}
                                </tbody>
                            </table>
                        </>
                    )}

                    {groupedCats.other.length > 0 && (
                        <>
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-semibold text-gray-900">
                                        Kõik teised kassid ({groupedCats.other.length})
                                    </h3>
                                </div>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Päästenr
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Nimi
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Hoiukodu
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Asukoht
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Sugu
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Sünniaeg
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Steriliseeritud
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Vaktsineeritud
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Tegevused
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedCats.other.map(renderCatRow)}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCatList;
