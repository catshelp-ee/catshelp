import type { AppMode } from '@config/app.ts';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import AuthStore from '@stores/AuthStore.ts';

import Header from './header.tsx';
import Sidebar from './sidebar.tsx';

const PageLayout = () => {
    const [appMode, setAppMode] = useState<AppMode>('foster');
    const isAdmin = AuthStore.isAdmin();
    const isFosterMode = appMode === 'foster';

    const DesktopView = () => {
        return (
            <div id="page" className="page">
                <Header appMode={appMode} setAppMode={setAppMode} isAdmin={isAdmin} />
                <div className="min-h-screen bg-gray-50">
                    {isFosterMode && <Sidebar />}
                    {isFosterMode ? (
                        <main className="lg:pl-64 pb-20 lg:pb-8">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                                <div className="space-y-6">
                                    <Outlet />
                                </div>
                            </div>
                        </main>
                    ) : (
                        <main className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
                            <Outlet />
                        </main>
                    )}
                </div>
            </div>
        );
    };

    return <DesktopView />;
};

export default observer(PageLayout);
