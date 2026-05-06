import { useTranslation } from '@hooks/use-translation.tsx';
import { IAnimal } from '@catshelp/types/src/index.ts';

interface Props {
    status: IAnimal['status'];
    size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: Props) {
    const { t } = useTranslation();

    const statusConfig = {
        'looking-for-home': {
            label: "lookingForHome",
            className: 'bg-green-100 text-green-700 border-green-200',
        },
        'not-listed': {
            label: "notListed",
            className: 'bg-gray-100 text-gray-700 border-gray-200',
        },
        'reserved': {
            label: "reserved",
            className: 'bg-amber-100 text-amber-700 border-amber-200',
        },
    };

    const config = statusConfig[status];
    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

    return (
        <span className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses}`}>
            {t(config.label)}
        </span>
    );
}
