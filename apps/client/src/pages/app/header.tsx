import type { AppMode } from '@config/app.ts';
import type { Language } from '@config/app.ts';
import { LANGUAGES } from '@config/app.ts';
import { useLanguage } from '@context/language-context.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';
import AuthStore from '@stores/AuthStore.ts';
import { Shield, User, Heart, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const tabButtonClass = (isActive: boolean) =>
    `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded cursor-pointer transition-colors ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
    }`;

interface ModeSwitcherProps {
    appMode: AppMode;
}

const ModeSwitcher = ({ appMode }: ModeSwitcherProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => {
                navigate("/dashboard");
            }} className={tabButtonClass(appMode === 'foster')}>
                <Heart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('mode.foster')}</span>
            </button>
            <button onClick={() => {
                navigate("/admin/cat-list");
            }} className={tabButtonClass(appMode === 'admin')}>
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('mode.admin')}</span>
            </button>
        </div>
    );
};

interface LanguageSwitcherProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageSwitcher = ({ language, setLanguage }: LanguageSwitcherProps) => (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {LANGUAGES.map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)} className={
                    `px-2 py-1 text-xs font-medium rounded transition-colors ` +
                    `${language === lang ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                {lang.toUpperCase()}
            </button>
        ))}
    </div>
);

interface UserAvatarProps {
    onLogout: () => void;
}

const UserAvatar = ({ onLogout }: UserAvatarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const { user } = AuthStore;

    useEffect(() => {
        // Close the dropdown when clicking outside the avatar/menu
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-full cursor-pointer flex items-center justify-center hover:bg-blue-200 transition-colors"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{t('nav.role.' + user?.role)}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                </div>
            )}
        </div>
    );
};

const Logo = ({ appMode }: { appMode: AppMode }) => {
    const { t } = useTranslation();

    return (
        <Link to="/dashboard" className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}header.png`} alt="Cats Help" className="h-10 w-auto" />
            <div>
                <div>
                    <div className="text-base font-semibold text-gray-900">{t('nav.title')}</div>
                </div>
                {appMode !== 'foster' && (
                    <div className="text-xs text-gray-600">
                        {t('nav.titleAdmin')}
                    </div>
                )}
            </div>
        </Link>
    );
};

interface HeaderProps {
    appMode: AppMode;
    isAdmin: boolean;
}

const Header = ({ appMode, isAdmin }: HeaderProps) => {
    const { language, setLanguage } = useLanguage();
    const { logout } = AuthStore;
    const isFosterMode = appMode === 'foster';

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <Logo appMode={appMode} />

                    <div className="flex items-center gap-2">
                        {isAdmin && <ModeSwitcher appMode={appMode} />}
                        {isFosterMode && <LanguageSwitcher language={language} setLanguage={setLanguage} />}
                        <UserAvatar onLogout={logout} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
