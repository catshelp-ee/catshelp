import {Shield, User, Heart, LogOut} from 'lucide-react';
import {useLanguage} from '@context/language-context';
import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {useAuth} from "@context/auth-context";
import {useTranslation} from "@hooks/use-translation";
import {AppMode} from "@config/app";
import {Language} from "@config/app";
import {LANGUAGES} from "@config/app";
import {useUser} from "@hooks/use-user";

const tabButtonClass = (isActive: boolean) =>
    `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
        isActive
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
    }`;

interface ModeSwitcherProps {
    appMode: AppMode;
    setAppMode: Dispatch<SetStateAction<AppMode>>;
}

const ModeSwitcher = ({appMode, setAppMode}: ModeSwitcherProps) => {
    const {t} = useTranslation();

    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setAppMode('foster')} className={tabButtonClass(appMode === 'foster')}>
                <Heart className="w-3.5 h-3.5"/>
                <span className="hidden sm:inline">{t("mode.foster")}</span>
            </button>
            <button onClick={() => setAppMode('admin')} className={tabButtonClass(appMode === 'admin')}>
                <Shield className="w-3.5 h-3.5"/>
                <span className="hidden sm:inline">{t("mode.admin")}</span>
            </button>
        </div>
    );
}

interface LanguageSwitcherProps {
    language: Language;
    setLanguage: Dispatch<SetStateAction<Language>>;
}

const LanguageSwitcher = ({language, setLanguage}: LanguageSwitcherProps) => (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {LANGUAGES.map((lang) => (
            <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={tabButtonClass(language === lang)}
            >
                {lang.toUpperCase()}
            </button>
        ))}
    </div>
);

interface UserAvatarProps {
    onLogout: () => void
}

const UserAvatar = ({onLogout}: UserAvatarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const {t} = useTranslation();
    const {user, loading, error} = useUser();


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
                onClick={() => setIsOpen(prev => !prev)}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"/>
            </button>

            {isOpen && (
                <div className="absolute flex flex-col right-0 mt-1 p-2 w-52 max-w-72 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <span>{t("nav.role." + user?.role)}</span>
                    <span className="text-xs text-secondary mb-4 break-all">{user?.email}</span>
                    <hr />
                    <button
                        onClick={onLogout}
                        className="flex gap-2 mt-4 p-2 text-sm text-red-700"
                    >
                        <LogOut /> {t("nav.logout")}
                    </button>
                </div>
            )}
        </div>
    );
};

const Logo = () => {
    const {t} = useTranslation();

    return (
        <div className="flex items-center gap-3 h-full">
            <img src="header.png" className="h-3/4" alt=""/>
            <div>
                <div className="text-base font-semibold text-gray-900">{t("nav.title")}</div>
            </div>
        </div>
    );
}

interface HeaderProps {
    appMode: AppMode;
    setAppMode: Dispatch<SetStateAction<AppMode>>;
    isAdmin: boolean;
}

const Header = ({appMode, isAdmin, setAppMode}: HeaderProps) => {
    const {language, setLanguage} = useLanguage();
    const {logout} = useAuth();
    const isFosterMode = appMode === 'foster';

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">

                <Logo/>

                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <ModeSwitcher appMode={appMode} setAppMode={setAppMode}/>
                    )}
                    {isFosterMode && (
                        <LanguageSwitcher language={language} setLanguage={setLanguage}/>
                    )}
                    {isFosterMode && <UserAvatar onLogout={logout}/>}
                </div>

            </div>
        </nav>
    );
};

export default Header;
