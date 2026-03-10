import {Shield, User, Heart} from 'lucide-react';
import {useLanguage} from '@context/language-context';
import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {useAuth} from "@context/auth-context";
import {useTranslation} from "@hooks/useTranslation";
import {AppMode} from "@app-types/app";
import {translations} from "@translations/translations";
import {Language} from "@app-types/language";
import {LANGUAGES} from "@config/app";

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
                <span className="hidden sm:inline">{t(translations.mode.foster)}</span>
            </button>
            <button onClick={() => setAppMode('admin')} className={tabButtonClass(appMode === 'admin')}>
                <Shield className="w-3.5 h-3.5"/>
                <span className="hidden sm:inline">{t(translations.mode.admin)}</span>
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
                <div
                    className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <button
                        onClick={onLogout}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {t(translations.nav.logout)}
                    </button>
                </div>
            )}
        </div>
    );
};

const Logo = () => (
    <div className="flex items-center gap-3">
        <div
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🐱</span>
        </div>
        <div>
            <div className="text-base font-semibold text-gray-900">Cats Help Portal</div>
        </div>
    </div>
);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

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
            </div>
        </nav>
    );
};

export default Header;