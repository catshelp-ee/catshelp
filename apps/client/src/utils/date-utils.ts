import moment from 'moment';

export const parseDate = (dateString: string | Date, t): Date | null => {
    if (!dateString) {
        return null;
    }

    const parsed = moment(dateString, 'DD.MM.YYYY');
    return parsed.isValid() ? parsed.toDate() : null;
};

export const calculateAge = (birthDate: Date, t: (s: string) => string): string => {
    if (!birthDate) {
        return '';
    }

    const birthDateMoment = moment(birthDate, 'DD.MM.YYYY');
    if (!birthDateMoment.isValid()) {
        return '';
    }

    const now = moment();
    const years = now.diff(birthDateMoment, 'years');
    const months = now.diff(
        birthDateMoment.clone().add(years, 'years'),
        'months'
    );

    if (years === 0) {
        return `${months} ${t('months')}`;
    }

    if (months === 0) {
        return `${years} ${t('years')}`;
    }
    return `${years} ${t('years')} ${t('conj')} ${months} ${t('months')}`;
};

export const isFutureDate = (date: Date): boolean => {
    if (!date) {
        return false;
    }

    return moment().isBefore(date);
};

export const parseEstonianDate = (dateString: string): Date | null => {
    try {
        const [day, month, year] = dateString.split('.').map(Number);
        if (!day || !month || !year) {
            return null;
        }
        return new Date(Date.UTC(year, month - 1, day));
    } catch {
        return null;
    }
};

export const formatDate = (date: Date | string | null, format?: string | null): string => {
    if (!date) {
        return '';
    }
    if (typeof date == 'string') {
        const momentDate = moment(date);
        if (!momentDate.isValid()) {
            return '';
        }
        date = momentDate.toDate();
    }
    if (format) {
        return moment(date).format(format);
    }
    return date.toLocaleDateString('et-EE');
};
