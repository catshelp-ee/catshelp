import { Profile } from "@catshelp/types/src";
import { formatEstonianDate } from "@catshelp/utils/src";
import { useIsMobile } from "@context/is-mobile-context";
import React, { useState } from "react";
import ImageGallery from "./image-gallery";
import { Label } from "@components/label";
import { Input } from "@components/input";
import { Textarea } from "@components/textarea";
import { Checkbox } from "@components/checkbox";
import { Button } from "@components/button";
import { Save } from "lucide-react";
import axios from "axios";
import { useAlert } from "@context/alert-context";

interface CatDetailsProps {
    selectedCat: Profile;
}

const personalityOptions = {
    'bold': { et: 'Julge', en: 'Bold', ru: 'Смелый' },
    'shy': { et: 'Arg', en: 'Shy', ru: 'Застенчивый' },
    'active': { et: 'Aktiivne', en: 'Active', ru: 'Активный' },
    'veryActive': { et: 'Väga aktiivne', en: 'Very active', ru: 'Очень активный' },
    'calm': { et: 'Rahulik', en: 'Calm', ru: 'Спокойный' },
    'friendly': { et: 'Sõbralik', en: 'Friendly', ru: 'Дружелюбный' },
    'grumpy': { et: 'Pahur', en: 'Grumpy', ru: 'Ворчливый' },
    'vocal': { et: 'Hellik', en: 'Vocal', ru: 'Разговорчивый' },
    'dislikesTouching': { et: 'Ei lase puudutada ennast', en: 'Doesn\'t allow touching', ru: 'Не позволяет прикасаться' },
    'sociable': { et: 'Seltsiv', en: 'Sociable', ru: 'Общительный' },
    'aloof': { et: 'Omaette hoidev', en: 'Aloof', ru: 'Отстраненный' },
    'goodAppetite': { et: 'Hea isuga', en: 'Good appetite', ru: 'Хороший аппетит' },
    'curious': { et: 'Uudishimulik', en: 'Curious', ru: 'Любопытный' },
    'playful': { et: 'Mänguline', en: 'Playful', ru: 'Игривый' },
    'stressed': { et: 'Stressis', en: 'Stressed', ru: 'В стрессе' },
    'sensitive': { et: 'Õrnahingeline', en: 'Sensitive', ru: 'Чувствительный' },
    'peaceful': { et: 'Rahumeelne', en: 'Peaceful', ru: 'Миролюбивый' },
    'selfish': { et: 'Isekas', en: 'Selfish', ru: 'Эгоистичный' },
    'hisses': { et: 'Sisiseb palju', en: 'Purrs a lot', ru: 'Много мурлычет' },
};

const likesOptions = {
    'beingOnLap': { et: 'Süles olla', en: 'Being on lap', ru: 'Сидеть на коленях' },
    'sleepsCuddling': { et: 'Kaisus magada', en: 'Sleep cuddling', ru: 'Спать в обнимку' },
    'likesPetting': { et: 'Pai saada', en: 'Getting petted', ru: 'Получать ласку' },
    'likesAttention': { et: 'Palju tähelepanu', en: 'Lots of attention', ru: 'Много внимания' },
    'likesPlayingWithPeople': { et: 'Mängida mänguasjadega inimesega', en: 'Play with toys with human', ru: 'Играть с игрушками с человеком' },
    'likesPlayingAlone': { et: 'Mängida mänguasjadega üksinda', en: 'Play with toys alone', ru: 'Играть с игрушками одна' },
};

const habitsOptions = {
    'usesLitterbox': { et: 'Kasutab liivakasti hästi', en: 'Uses litter box well', ru: 'Хорошо использует лоток' },
    'usesScratchingpost': { et: 'Kasutab kratsimispuud hästi', en: 'Uses scratching post well', ru: 'Хорошо использует когтеточку' },
    'selectiveWithFood': { et: 'On valikuline toiduga, pirtsutab', en: 'Picky with food, splashes', ru: 'Привередлив с едой, разбрасывает' },
    'adaptable': { et: 'Harjub kiirelt uue kohaga', en: 'Adapts quickly to new place', ru: 'Быстро привыкает к новому месту' },
    'scratchesFurniture': { et: 'Kipub kratsima muud mööblit', en: 'Tends to scratch other furniture', ru: 'Склонен царапать другую мебель' },
    'trusting': { et: 'Usaldab inimesi kiiresti', en: 'Trusts people quickly', ru: 'Быстро доверяет людям' },
};

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

const CatMainInfo: React.FC<{
    selectedCat: Profile,
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile | null>>
}> = ({ selectedCat, setSelectedCat }) => {
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
                    <p className="section-value">{selectedCat.mainInfo.coatColour}</p>
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

const CatPersonalityInfo: React.FC<{
    selectedCat: Profile,
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile | null>>
}> = ({ selectedCat, setSelectedCat }) => {
    const setValue = (key: string, value: string | boolean) => {
        setSelectedCat({ ...selectedCat, personalityInfo: { ...selectedCat.personalityInfo, [key]: value } });
    };
    return (
        <div className="profile-section">
            <h2 className="section-header">Iseloom ja Sobivus</h2>

            <div className="space-y-6">
                <div>
                    <Label className="block">
                        Iseloomujooned
                    </Label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {Object.keys(personalityOptions).map((key) => (
                            <label
                                key={key}
                                className="flex items-center gap-2 p-2 rounded-sm hover:bg-gray-50 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selectedCat.personalityInfo[key]}
                                    onCheckedChange={(value) => { setValue(key, value) }}
                                />
                                <span className="text-sm">{personalityOptions[key].et}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="block">
                        Kassile meeldib
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.keys(likesOptions).map((key) => (
                            <label
                                key={key}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selectedCat.personalityInfo[key]}
                                    onCheckedChange={(value) => { setValue(key, value) }}
                                />
                                <span className="text-sm">{likesOptions[key].et}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="block">
                        Harjumused ja käitumine
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.keys(habitsOptions).map((key) => (
                            <label
                                key={key}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selectedCat.personalityInfo[key]}
                                    onCheckedChange={(value) => { setValue(key, value) }}
                                />
                                <span className="text-sm">{habitsOptions[key].et}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <Label htmlFor="dailyDescription">
                        Kirjelda kassi mõne iseloomustava lausega
                    </Label>

                    <Textarea
                        id="dailyDescription"
                        value={selectedCat.personalityInfo.description || ''}
                        onChange={(e) => { }}
                        rows={3}
                        placeholder={'Nt milline on kiisu argipäev'}
                        className="resize-y"
                    />
                </div>
            </div>
        </div>
    );
};

const CatDetails: React.FC<CatDetailsProps> = ({
    selectedCat,
    setSelectedCat
}) => {
    const isMobile = useIsMobile();
    const { showAlert } = useAlert();

    const handleSave = async () => {
        if (selectedCat) {
            await axios.put("/api/animals", selectedCat).then(() => {
                showAlert('Success', "Andmed uuendatud!");
            }).catch((error) => {
                showAlert('Error', "Andmete uuendamine ebaõnnestus");
            })
        }
    };

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
                <CatMainInfo selectedCat={selectedCat} setSelectedCat={setSelectedCat} />
                <CatPersonalityInfo selectedCat={selectedCat} setSelectedCat={setSelectedCat} />

                <div className="sticky bottom-20 lg:bottom-6 z-10">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
                        <Button
                            onClick={handleSave}
                            disabled={!selectedCat}
                            className="w-full"
                            size="lg"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Salvesta ja uuenda veebis
                        </Button>
                    </div>
                </div>

            </div>
            {!isMobile && <ImageGallery animalId={selectedCat.animalId} name={selectedCat.mainInfo.name} images={selectedCat?.images || []} />}
        </>
    );
};

export default CatDetails;
