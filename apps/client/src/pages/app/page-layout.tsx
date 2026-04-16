import {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from './header';
import {useAuth} from "@context/auth-context";
import {AppMode} from "@config/app";

const PageLayout = () => {
    const { checkIfAdmin } = useAuth();

    const [appMode, setAppMode] = useState<AppMode>('foster');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!checkIfAdmin()) {
            return;
        }

        setIsAdmin(true);
    }, [checkIfAdmin]);


    const DesktopView = () => {
        return (
            <div id="page" className="page">
                <Header appMode={appMode} setAppMode={setAppMode} isAdmin={isAdmin} />
                <div className="min-h-screen bg-gray-50">
                    <Sidebar />
                    <main className="lg:pl-64 pb-20 lg:pb-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                            <div className="space-y-6">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <DesktopView />
    );
};

export default PageLayout;
