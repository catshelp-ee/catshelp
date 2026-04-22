import {useLanguage} from "@context/language-context.tsx";
import {translate} from "@translations/translate.ts";
import { translations } from "@translations/translations.ts";

export function useTranslation() {
    const {language} = useLanguage();

    const t = (path: string) => {
        const object = path.split('.').reduce((obj: any, key) => obj[key], translations);
        return translate(object, language);
    }

    return {t};
}