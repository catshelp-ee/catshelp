import {useLocation, useNavigate} from "react-router-dom";

import { LayoutDashboard, Cat, Heart } from 'lucide-react';
import type {Screen} from "@config/app";
import {useTranslation} from "@hooks/use-translation";

export function Sidebar() {

    const navigate = useNavigate();
    const url = useLocation();
    const { t } = useTranslation();

    const navItems = [
        {
            id: 'dashboard' as Screen,
            label: t("nav.dashboard"),
            icon: LayoutDashboard,
            path: "/users"
        },
        {
            id: 'cat-profile' as Screen,
            label: t("nav.catProfile"),
            icon: Cat,
            path: "/cat-profile"
        },
        {
            id: 'medical' as Screen,
            label: t("nav.medical"),
            icon: Heart,
        },
    ];

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = url.pathname.includes(item.path);

                        return (
                            <button
                                key={item.id}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                    navigate(item.path)
                                }}
                            >
                                <Icon className={`w-5 h-5 text-gray-500`} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile bottom navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-gray-600`}
                            >
                                <Icon className={`w-5 h-5 text-gray-500`} />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

export default Sidebar;
