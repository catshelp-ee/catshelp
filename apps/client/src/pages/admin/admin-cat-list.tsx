import React from 'react';

const AdminCatList: React.FC = () => {

    const filteredAndSortedCats = [];
    const filters = {};
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
        </div>
    );
};

export default AdminCatList;
