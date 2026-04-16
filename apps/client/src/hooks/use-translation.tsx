import {useLanguage} from "@context/language-context";
import {translate} from "@translations/translate";
import { translations } from "@translations/translations";

export function useTranslation() {
    const {language} = useLanguage();

    const t = (path: string) => {
        const object = path.split('.').reduce((obj: any, key) => obj[key], translations);
        return translate(object, language);
    }

    return {t};
}