import { Profile } from "@catshelp/types/src";
import { formatEstonianDate } from "@catshelp/utils/src";
import { useIsMobile } from "@context/is-mobile-context";
import React, { useEffect, useState } from "react";
import ImageGallery from "./image-gallery";
import { Label } from "@components/label";
import { Input } from "@components/input";
import { Textarea } from "@components/textarea";
import { Checkbox } from "@components/checkbox";

interface CatDetailsProps {
    selectedCat: Profile;
}

const personalityOptions = [
    { et: 'Julge', en: 'Bold', ru: 'Смелый' },
    { et: 'Arg', en: 'Shy', ru: 'Застенчивый' },
    { et: 'Aktiivne', en: 'Active', ru: 'Активный' },
    { et: 'Väga aktiivne', en: 'Very active', ru: 'Очень активный' },
    { et: 'Rahulik', en: 'Calm', ru: 'Спокойный' },
    { et: 'Sõbralik', en: 'Friendly', ru: 'Дружелюбный' },
    { et: 'Pahur', en: 'Grumpy', ru: 'Ворчливый' },
    { et: 'Hellik', en: 'Vocal', ru: 'Разговорчивый' },
    { et: 'Ei lase puudutada ennast', en: 'Doesn\'t allow touching', ru: 'Не позволяет прикасаться' },
    { et: 'Seltsiv', en: 'Sociable', ru: 'Общительный' },
    { et: 'Omaette hoidev', en: 'Aloof', ru: 'Отстраненный' },
    { et: 'Hea isuga', en: 'Good appetite', ru: 'Хороший аппетит' },
    { et: 'Uudishimulik', en: 'Curious', ru: 'Любопытный' },
    { et: 'Mänguline', en: 'Playful', ru: 'Игривый' },
    { et: 'Stressis', en: 'Stressed', ru: 'В стрессе' },
    { et: 'Õrnahingeline', en: 'Sensitive', ru: 'Чувствительный' },
    { et: 'Rahumeelne', en: 'Peaceful', ru: 'Миролюбивый' },
    { et: 'Isekas', en: 'Selfish', ru: 'Эгоистичный' },
    { et: 'Sisiseb palju', en: 'Purrs a lot', ru: 'Много мурлычет' },
];

const likesOptions = [
    { et: 'Süles olla', en: 'Being on lap', ru: 'Сидеть на коленях' },
    { et: 'Kaisus magada', en: 'Sleep cuddling', ru: 'Спать в обнимку' },
    { et: 'Pai saada', en: 'Getting petted', ru: 'Получать ласку' },
    { et: 'Palju tähelepanu', en: 'Lots of attention', ru: 'Много внимания' },
    { et: 'Mängida mänguasjadega inimesega', en: 'Play with toys with human', ru: 'Играть с игрушками с человеком' },
    { et: 'Mängida mänguasjadega üksinda', en: 'Play with toys alone', ru: 'Играть с игрушками одна' },
];

const habitsOptions = [
    { et: 'Kasutab liivakasti hästi', en: 'Uses litter box well', ru: 'Хорошо использует лоток' },
    { et: 'Kasutab kratsimispuud hästi', en: 'Uses scratching post well', ru: 'Хорошо использует когтеточку' },
    { et: 'On valikuline toiduga, pirtsutab', en: 'Picky with food, splashes', ru: 'Привередлив с едой, разбрасывает' },
    { et: 'Harjub kiirelt uue kohaga', en: 'Adapts quickly to new place', ru: 'Быстро привыкает к новому месту' },
    { et: 'Kipub kratsima muud mööblit', en: 'Tends to scratch other furniture', ru: 'Склонен царапать другую мебель' },
    { et: 'Usaldab inimesi kiiresti', en: 'Trusts people quickly', ru: 'Быстро доверяет людям' },
];

const CatDetailsHeader: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => (
    <div className="profile-section">
        <h1 className="profile-title">{selectedCat?.mainInfo.name}</h1>
        <p className="section-label">Päästenumber: {selectedCat.mainInfo.rankNr}</p>
        {/* Todo kategooria ikoonid ja märgi broneerituks nupp */}
    </div>
);

const CatBlogPost: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => (
    <div className="profile-section">
        <h2 className="section-header">Kuulutuse pealkiri ja tekst</h2>
        {/* Todo kuulutuse plokki sisu */}
    </div>
);

const CatMainInfo: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => {
    return (
        <div className="profile-section">
            <h2 className="section-header">Põhiandmed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="section-label">Sünniaeg</p>
                    <p className="section-value">{formatEstonianDate(selectedCat.mainInfo.birthDate, 'YYYY-MM-DD')}</p>
                </div>
                <div>
                    <p className="section-label">Päästmiskuupäev</p>
                    <p className="section-value">{formatEstonianDate(selectedCat.mainInfo.rescueDate, 'YYYY-MM-DD')}</p>
                </div>
                <div>
                    <p className="section-label">Sugu</p>
                    <p className="section-value">{selectedCat.mainInfo.gender}</p>
                </div>
                <div>
                    <p className="section-label">Värv</p>
                    <p className="section-value">{selectedCat.mainInfo.coatColor}</p>
                </div>
                <div>
                    <p className="section-label">Karva pikkus</p>
                    <p className="section-value">{selectedCat.mainInfo.coatLength}</p>
                </div>
                <div>
                    <p className="section-label">Asukoht</p>
                    <p className="section-value">{selectedCat.mainInfo.location}</p>
                </div>
                <div>
                    <p className="section-label">Kiibinumber</p>
                    <p className="section-value">{selectedCat.mainInfo.microchip}</p>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                <div>
                    <Label htmlFor="timeInCare">
                        Aeg hoolduses
                    </Label>
                    <Input
                        id="timeInCare"
                        value='TODO'
                        onChange={(e) => { }}
                        placeholder='Nt 3 kuud, 1 aasta'
                    />
                </div>

                <div>
                    <Label htmlFor="chronicIllness">
                        Krooniline haigus
                    </Label>
                    <Input
                        id="chronicIllness"
                        value={selectedCat.mainInfo.chronicConditions || ''}
                        onChange={(e) => { }}
                        placeholder='Kui pole, jäta tühjaks'
                    />
                </div>

                <div>
                    <Label htmlFor="notes">
                        Märkmed
                    </Label>
                    <Textarea
                        id="notes"
                        value={selectedCat.mainInfo.description || ''}
                        onChange={(e) => { }}
                        rows={2}
                        placeholder='Täiendavad märkmed'
                        className="resize-y"
                    />
                </div>

                <div>
                    <Label htmlFor="rescueStory">
                        Päästmise lugu
                    </Label>
                    <Textarea
                        id="rescueStory"
                        value={selectedCat.mainInfo.rescueStory || ''}
                        onChange={(e) => { }}
                        rows={3}
                        placeholder='Kirjelda, kuidas kass meie MTÜ hoole alla sattus'
                        className="resize-y"
                    />
                </div>

            </div>
        </div>
    );
};

const CatPersonalityInfo: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => {
    return (
        <div className="profile-section">
            <h2 className="section-header">Iseloom ja Sobivus</h2>

            <div className="space-y-6">
                <div>
                    <Label className="block">
                        Iseloomujooned
                    </Label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {personalityOptions.map((option) => (
                            <label
                                key={option.en}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selectedCat.personalityInfo[option.en]}
                                    onCheckedChange={() => { }}
                                />
                                <span className="text-sm">{option.et}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="block">
                        Kassile meeldib
                    </Label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {likesOptions.map((option) => (
                            <label
                                key={option.en}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selectedCat.personalityInfo[option.en]}
                                    onCheckedChange={() => { }}
                                />
                                <span className="text-sm">{option.et}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="block">
                        Harjumused ja käitumine
                    </Label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {habitsOptions.map((option) => (
                            <label
                                key={option.en}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selectedCat.personalityInfo[option.en]}
                                    onCheckedChange={() => { }}
                                />
                                <span className="text-sm">{option.et}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const extractProcedures = (profile: Profile): string => {

    const procedures = [];
    /*
    if (!profile.characteristics.textFields.gender.split(' ')[0].endsWith('mata')) {
        procedures.push("Lõigatud");
    }

    if (isFutureDate(profile.vaccineInfo.nextComplexVaccineDate)) {
        procedures.push('Kompleksvaktsiin');
    }

    if (isFutureDate(profile.vaccineInfo.nextRabiesVaccineDate)) {
        procedures.push('Marutaudi vaktsiin');
    }

    if (profile.vaccineInfo.dewormingOrFleaTreatmentDate) {
        procedures.push('Ussirohi');
    }
        */

    return procedures.join(', ');

}

const CatDetails: React.FC<CatDetailsProps> = ({
    selectedCat,
}) => {
    const isMobile = useIsMobile();

    const capitalize = str => {
        if (!str) {
            return ""
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    };

    /*
    const FIELD_LABELS = {
        "Kassi sugu": capitalize(selectedCat.characteristics.textFields.gender),
        "Kassi vanus": calculateAge(selectedCat.mainInfo.birthDate),
        "Kassi välimus": [
            selectedCat.characteristics.selectFields.coatColour,
            selectedCat.characteristics.selectFields.coatLength
        ].filter(Boolean).join(' '),
        "Kassi asukoht": selectedCat.mainInfo.location,
        "Mis protseduurid hoiulisel tehtud on?": extractProcedures(selectedCat),
        "Kui kassil esineb krooniline haigus, vajab eritoitu või on vigastus palun kirjuta siia sellest": selectedCat.characteristics.textFields.chronicConditions,
        "Kui kaua on kass hoiukodus/kassitoas viibinud?": selectedCat.characteristics.textFields.fosterStayDuration,
        "Iseloom": selectedCat.characteristics.multiselectFields.personality.join(", "),
        "Kassile meeldib": selectedCat.characteristics.multiselectFields.likes.join(", "),
        "Kirjelda kassi mõne iseloomustava lausega (nt milline on kiisu argipäev)": selectedCat.characteristics.textFields.description,
        "Kuidas suhtub teistesse kassidesse?": selectedCat.characteristics.selectFields.attitudeTowardsCats,
        "Kuidas suhtub koertesse?": selectedCat.characteristics.selectFields.attitudeTowardsDogs,
        "Kuidas suhtub lastesse?": selectedCat.characteristics.selectFields.attitudeTowardsChildren,
        "Kuidas ta sobiks toa- või õuekassikas?": selectedCat.characteristics.selectFields.suitabilityForIndoorOrOutdoor
    } as const;
     */

    /*
    useEffect(() => {
        selectedCat.profilePictureFilename = selectedProfilePicture;
    }, [selectedProfilePicture])
    */


    return (
        <>
            {isMobile && (
                <ImageGallery animalId={selectedCat.animalId} images={selectedCat?.images || []} />
            )}
            <div className='w-full'>
                <CatDetailsHeader
                    selectedCat={selectedCat}
                />

                <CatBlogPost selectedCat={selectedCat} />
                <CatMainInfo selectedCat={selectedCat} />
                <CatPersonalityInfo selectedCat={selectedCat} />
            </div>
            {!isMobile && <ImageGallery animalId={selectedCat.animalId} name={selectedCat.mainInfo.name} images={selectedCat?.images || []} />}
        </>
    );
};

export default CatDetails;
