import { Profile } from "@catshelp/types/src/index.ts";
import { formatDate } from "@catshelp/utils/src/index.ts";
import React, { useState } from "react";
import { Label } from "@components/label.tsx";
import { Input } from "@components/input.tsx";
import { Textarea } from "@components/textarea.tsx";
import { Checkbox } from "@components/checkbox.tsx";
import { Button } from "@components/button.tsx";
import { Save, Upload, Star, Trash2 } from "lucide-react";
import axios from "axios";
import { useAlert } from "@context/alert-context.tsx";
import { readFileAsDataURL, resizeImage } from "@utils/image-utils.ts";

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

const CatDetailsHeader: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => {
    const profileImage = selectedCat.images ? selectedCat.images.find(img => img.type === 'profile') : null;
    return (
        <div className="profile-section">
            <div className="flex gap-4">
                {/* Profile image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center shrink-0">
                    {profileImage ? (
                        <img
                            src={profileImage.data}
                            alt={selectedCat.mainInfo.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-4xl">🐱</span>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        {selectedCat?.mainInfo.name}
                    </h1>
                    <p className="text-sm text-gray-600 mb-3">
                        Päästenumber: {selectedCat.mainInfo.rankNr}
                    </p>
                </div>
            </div>
        </div>);
};

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

    const setValue = (key: string, value: string | boolean) => {
        const updatedCatInfo = { ...selectedCat, mainInfo: { ...selectedCat.mainInfo, [key]: value } };
        setSelectedCat(updatedCatInfo);
    };

    return (
        <div className="profile-section">
            <h2 className="section-header">Põhiandmed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="section-label">Sünniaeg</p>
                    <p className="section-value">{formatDate(selectedCat.mainInfo.birthDate, 'YYYY-MM-DD')}</p>
                </div>
                <div>
                    <p className="section-label">Päästmiskuupäev</p>
                    <p className="section-value">{formatDate(selectedCat.mainInfo.rescueDate, 'YYYY-MM-DD')}</p>
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
                        onChange={(e) => { setValue('chronicConditions', e.target.value) }}
                        placeholder='Kui pole, jäta tühjaks'
                    />
                </div>

                <div>
                    <Label htmlFor="notes">
                        Märkmed
                    </Label>
                    <Textarea
                        id="notes"
                        value={selectedCat.mainInfo.additionalNotes || ''}
                        onChange={(e) => { setValue('additionalNotes', e.target.value) }}
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
                        onChange={(e) => { setValue('rescueStory', e.target.value) }}
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
        const updatedCatInfo = { ...selectedCat, personalityInfo: { ...selectedCat.personalityInfo, [key]: value } };
        setSelectedCat(updatedCatInfo);
    };
    const setMainInfoValue = (key: string, value: string) => {
        const updatedCatInfo = { ...selectedCat, mainInfo: { ...selectedCat.mainInfo, [key]: value } };
        setSelectedCat(updatedCatInfo);
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
                        value={selectedCat.mainInfo.description || ''}
                        onChange={(e) => { setMainInfoValue('description', e.target.value) }}
                        rows={3}
                        placeholder={'Nt milline on kiisu argipäev'}
                        className="resize-y"
                    />
                </div>
                <div>
                    <Label htmlFor="specialRequirements">
                        Erisoovid uuele perele
                    </Label>

                    <Textarea
                        id="specialRequirements"
                        value={selectedCat.mainInfo.specialRequirementsForNewFamily || ''}
                        onChange={(e) => { setMainInfoValue('specialRequirementsForNewFamily', e.target.value) }}
                        rows={3}
                        placeholder={'Nt vajab kõrvale kassi, ilma lasteta pere, rahulikuma eluviisiga pere, kass vajab suurt tähelepanu jne'}
                        className="resize-y"
                    />
                </div>
            </div>
        </div>
    );
};

const CatImages: React.FC<{
    selectedCat: Profile,
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile | null>>
}> = ({ selectedCat, setSelectedCat }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = async (files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            return;
        }
        const newImages = await Promise.all(imageFiles.map(async (file) => {
            const resizedImage = await resizeImage(file);
            const data = await readFileAsDataURL(resizedImage);

            return {
                id: 0,
                data: data,
                type: 'image'
            }
        }));
        const updatedCatInfo = { ...selectedCat, images: selectedCat.images.concat(newImages) };
        setSelectedCat(updatedCatInfo);
    };

    const handleSetProfile = (index: number) => {
        const updatedImages = selectedCat.images.map((img, i) => {
            img.type = (i === index) ? 'profile' : 'image';
            return img;
        });
        const updatedCatInfo = { ...selectedCat, images: updatedImages };
        setSelectedCat(updatedCatInfo);
    };

    const handleRemove = (index: number) => {
        const newImages = selectedCat.images.filter((_, i) => i !== index);
        const updatedCatInfo = { ...selectedCat, images: newImages };
        setSelectedCat(updatedCatInfo);
    };

    return (
        <div className="profile-section">
            <h2 className="section-header">Pildid</h2>

            {/* Photo gallery grid */}
            {selectedCat.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    {selectedCat.images.map((image, index) => {
                        const isProfilePic = image.type === 'profile';
                        return (
                            <div key={`${selectedCat.animalId}-${index}`} className="relative group">
                                <div
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${isProfilePic
                                        ? 'border-emerald-500 ring-2 ring-emerald-200'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={image.data}
                                        //alt={`${catName} foto ${index + 1}`} TODO
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Profile pic badge */}
                                {isProfilePic && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>Profiilipilt</span>
                                    </div>
                                )}

                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-end justify-center opacity-0 group-hover:opacity-100 pb-3 gap-2">
                                    {!isProfilePic && (
                                        <button
                                            onClick={() => handleSetProfile(index)}
                                            className="flex items-center gap-1 bg-white text-gray-800 text-xs px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-emerald-50 transition-colors"
                                            title="Profiilipilt"
                                        >
                                            <Star className="w-3 h-3" />
                                            Profiilipilt
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="flex items-center gap-1 bg-white text-red-600 text-xs px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                                        title="Kustuta"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Kustuta
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}



            {/* Upload area */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFiles(Array.from(e.dataTransfer.files));
                }}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <div className="text-sm text-gray-600 mb-1">
                    Lohista pildid siia või {' '}
                    <label className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium">
                        vali failid
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleFiles(Array.from(e.target.files));
                                }
                                e.target.value = '';
                            }}
                        />
                    </label>
                </div>
                <p className="text-xs text-gray-500">Maksimaalselt 10 pilti. JPG, PNG, WebP</p>
            </div>
        </div>
    );
};

const CatDetails: React.FC<{
    selectedCat: Profile,
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile | null>>
}> = ({
    selectedCat,
    setSelectedCat
}) => {
        const { showAlert } = useAlert();
        const handleSave = async () => {
            console.log('Salvestatud kassiprofiil:', selectedCat);
            if (selectedCat) {
                await axios.put("/api/animals", selectedCat).then(() => {
                    showAlert('Success', "Andmed uuendatud!");
                }).catch((error) => {
                    showAlert('Error', "Andmete uuendamine ebaõnnestus");
                })
            }
        };

        return (
            <> {Object.keys(selectedCat || {}).length > 0 && (
                <div className='w-full'>
                    <CatDetailsHeader selectedCat={selectedCat} />

                    <CatBlogPost selectedCat={selectedCat} />
                    <CatMainInfo selectedCat={selectedCat} setSelectedCat={setSelectedCat} />
                    <CatPersonalityInfo selectedCat={selectedCat} setSelectedCat={setSelectedCat} />
                    <CatImages selectedCat={selectedCat} setSelectedCat={setSelectedCat} />

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
                </div>)}
            </>
        );
    };

export default CatDetails;
