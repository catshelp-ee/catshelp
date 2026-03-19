export type AppMode = 'admin' | 'foster';

export const checkIfAdmin = async (getUser, setIsAdmin) => {
    const user = await getUser();

    if (user.role !== "ADMIN"){
        return;
    }

    setIsAdmin(true);
}

export type Language = 'et' | 'en' | 'ru';

export const LANGUAGES: Language[] = ['et', 'en', 'ru'];

export type Screen = 'dashboard' | 'cat-profile' | 'medical';

