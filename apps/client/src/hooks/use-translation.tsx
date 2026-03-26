import {useLanguage} from "@context/language-context";
import {translate} from "@translations/translate";

export function useTranslation() {
    const {language} = useLanguage();

    const t = (phrase) => {
        return translate(phrase, language);
    }

    return {t};
}