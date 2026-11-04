import type { Profile } from '@interfaces/profile.ts';
import { formatDate } from '@utils/date-utils.ts';
import { Button } from '@components/button.tsx';
import { Checkbox } from '@components/checkbox.tsx';
import { Input } from '@components/input.tsx';
import { Label } from '@components/label.tsx';
import { Textarea } from '@components/textarea.tsx';
import { useAlert } from '@context/alert-context.tsx';
import axios from 'axios';
import React, { useState } from 'react';
import { Save, Upload, Star, Trash2 } from "lucide-react";
import { readFileAsDataURL, resizeImage } from "@utils/image-utils.ts";
import { useTranslation } from '@hooks/use-translation.tsx';

const personalityOptions = [
    'bold',
    'shy',
    'active',
    'veryActive',
    'calm',
    'friendly',
    'grumpy',
    'vocal',
    'dislikesTouching',
    'sociable',
    'aloof',
    'goodAppetite',
    'curious',
    'playful',
    'stressed',
    'sensitive',
    'peaceful',
    'selfish',
    'hisses',
];

const likesOptions = [
    'beingOnLap',
    'sleepsCuddling',
    'likesPetting',
    'likesAttention',
    'likesPlayingWithPeople',
    'likesPlayingAlone',
];

const habitsOptions = [
    'usesLitterbox',
    'usesScratchingpost',
    'selectiveWithFood',
    'adaptable',
    'scratchesFurniture',
    'trusting',
];

const CatDetailsHeader: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => {
    const { t } = useTranslation();
    const profileImage = selectedCat.images ? selectedCat.images.find(img => img.type === 'profile') : null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            {selectedCat?.mainInfo.name}
                        </h1>
                        <p className="text-sm text-gray-600 mb-3">
                            {t('catDetails.rescueId')}: {selectedCat.mainInfo.rankNr}
                        </p>
                    </div>
                </div>
            </div>
        </div>);
};

const CatBlogPost: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => {
    const { t } = useTranslation();
    return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('catDetails.listingInfo')}
        </h2>
        {/* Todo kuulutuse plokki sisu */}
    </div>
    );
};

const CatMainInfo: React.FC<{
    selectedCat: Profile;
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile | null>>;
}> = ({ selectedCat, setSelectedCat }) => {
    const { t } = useTranslation();
    const setValue = (key: string, value: string | boolean) => {
        const updatedCatInfo = {
            ...selectedCat,
            mainInfo: { ...selectedCat.mainInfo, [key]: value },
        };
        setSelectedCat(updatedCatInfo);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('catDetails.baseInfo')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-600 mb-1">{t('catDetails.birthDate')}</p>
                    <p className="text-gray-900">{formatDate(selectedCat.mainInfo.birthDate, 'YYYY-MM-DD')}</p>
                </div>
                <div>
                    <p className="text-gray-600 mb-1">{t('catDetails.rescueDate')}</p>
                    <p className="text-gray-900">{formatDate(selectedCat.mainInfo.rescueDate, 'YYYY-MM-DD')}</p>
                </div>
                <div>
                    <p className="text-gray-600 mb-1">{t('catDetails.gender')}</p>
                    <p className="text-gray-900">{selectedCat.mainInfo.gender}</p>
                </div>
                <div>
                    <p className="text-gray-600 mb-1">{t('catDetails.color')}</p>
                    <p className="text-gray-900">{selectedCat.mainInfo.coatColour}</p>
                </div>
                <div>
                    <p className="text-gray-600 mb-1">{t('catDetails.furLength')}</p>
                    <p className="text-gray-900">{selectedCat.mainInfo.coatLength}</p>
                </div>
                <div>
                    <p className="text-gray-600 mb-1">{t('catDetails.location')}</p>
                    <p className="text-gray-900">{selectedCat.mainInfo.location}</p>
                </div>
                <div>
                    <p className="text-gray-600 mb-1">{t('catDetails.chipNumber')}</p>
                    <p className="text-gray-900">{selectedCat.mainInfo.microchip}</p>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div>
                    <Label htmlFor="timeInCare">
                        {t('catDetails.timeInCare')}
                    </Label>
                    <Input id="timeInCare" value="TODO" onChange={(e) => { }} placeholder={t('catDetails.timeInCarePlaceholder')} />
                </div>

                <div>
                    <Label htmlFor="chronicIllness">
                        {t('catDetails.chronicIllness')}
                    </Label>
                    <Input
                        id="chronicIllness"
                        value={selectedCat.mainInfo.chronicConditions || ''}
                        onChange={(e) => {
                            setValue('chronicConditions', e.target.value);
                        }}
                        placeholder={t('catDetails.chronicIllnessPlaceholder')}
                    />
                </div>

                <div>
                    <Label htmlFor="notes">
                        {t('catDetails.notes')}
                    </Label>
                    <Textarea
                        id="notes"
                        value={selectedCat.mainInfo.additionalNotes || ''}
                        onChange={(e) => {
                            setValue('additionalNotes', e.target.value);
                        }}
                        rows={2}
                        placeholder={t('catDetails.notesPlaceholder')}
                        className="resize-y"
                    />
                </div>

                <div>
                    <Label htmlFor="rescueStory">
                        {t('catDetails.rescueStory')}
                    </Label>
                    <Textarea
                        id="rescueStory"
                        value={selectedCat.mainInfo.rescueStory || ''}
                        onChange={(e) => {
                            setValue('rescueStory', e.target.value);
                        }}
                        rows={3}
                        placeholder={t('catDetails.rescueStoryPlaceholder')}
                        className="resize-y"
                    />
                </div>
            </div>
        </div>
    );
};

const CatPersonalityInfo: React.FC<{
    selectedCat: Profile;
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile | null>>;
}> = ({ selectedCat, setSelectedCat }) => {
    const { t } = useTranslation();
    const setValue = (key: string, value: string | boolean) => {
        const updatedCatInfo = {
            ...selectedCat,
            personalityInfo: { ...selectedCat.personalityInfo, [key]: value },
        };
        setSelectedCat(updatedCatInfo);
    };
    const setMainInfoValue = (key: string, value: string) => {
        const updatedCatInfo = {
            ...selectedCat,
            mainInfo: { ...selectedCat.mainInfo, [key]: value },
        };
        setSelectedCat(updatedCatInfo);
    };
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('catDetails.personalityAndCompatibility')}
            </h2>

            <div className="space-y-6">
                <div>
                    <Label className="block">
                        {t('catDetails.personalityOptions.title')}
                    </Label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {personalityOptions.map((key) => (
                            <label key={key} className="flex items-center gap-2 p-2 rounded-sm hover:bg-gray-50 cursor-pointer">
                                <Checkbox
                                    checked={selectedCat.personalityInfo[key]}
                                    onCheckedChange={(value) => {
                                        setValue(key, value);
                                    }}
                                />
                                <span className="text-sm">{t(`catDetails.personalityOptions.${key}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="block">
                        {t('catDetails.likesOptions.title')}
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {likesOptions.map((key) => (
                            <label key={key} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                <Checkbox
                                    checked={selectedCat.personalityInfo[key]}
                                    onCheckedChange={(value) => {
                                        setValue(key, value);
                                    }}
                                />
                                <span className="text-sm">{t(`catDetails.likesOptions.${key}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <Label className="block">
                        {t('catDetails.habitsOptions.title')}
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {habitsOptions.map((key) => (
                            <label key={key} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                <Checkbox
                                    checked={selectedCat.personalityInfo[key]}
                                    onCheckedChange={(value) => {
                                        setValue(key, value);
                                    }}
                                />
                                <span className="text-sm">{t(`catDetails.habitsOptions.${key}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <Label htmlFor="dailyDescription">
                        {t('catDetails.dailyDescription')}
                    </Label>
                    <Textarea
                        id="dailyDescription"
                        value={selectedCat.mainInfo.description || ''}
                        onChange={(e) => {
                            setMainInfoValue('description', e.target.value);
                        }}
                        rows={3}
                        placeholder={t('catDetails.dailyDescriptionPlaceholder')}
                        className="resize-y"
                    />
                </div>
                <div>
                    <Label htmlFor="specialRequirements">
                        {t('catDetails.specialRequirements')}
                    </Label>

                    <Textarea
                        id="specialRequirements"
                        value={selectedCat.mainInfo.specialRequirementsForNewFamily || ''}
                        onChange={(e) => {
                            setMainInfoValue('specialRequirementsForNewFamily', e.target.value);
                        }}
                        rows={3}
                        placeholder={t('catDetails.specialRequirementsPlaceholder')}
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
    const { t } = useTranslation();
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('photoGallery.title')}
            </h2>

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
                                        alt={`${selectedCat.mainInfo.name} foto ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Profile pic badge */}
                                {isProfilePic && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>{t('photoGallery.profilePic')}</span>
                                    </div>
                                )}

                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-end justify-center opacity-0 group-hover:opacity-100 pb-3 gap-2">
                                    {!isProfilePic && (
                                        <button
                                            onClick={() => handleSetProfile(index)}
                                            className="flex items-center gap-1 bg-white text-gray-800 text-xs px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-emerald-50 transition-colors"
                                            title={t('photoGallery.setAsProfile')}
                                        >
                                            <Star className="w-3 h-3" />
                                            {t('photoGallery.setAsProfile')}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="flex items-center gap-1 bg-white text-red-600 text-xs px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                                        title={t('photoGallery.delete')}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        {t('photoGallery.delete')}
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
                    {t('photoGallery.dragDrop')} {' '}
                    <label className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium">
                        {t('photoGallery.browse')}
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
                <p className="text-xs text-gray-500">{t('photoGallery.maxFiles', 10)}</p>
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
        const { t } = useTranslation();
        const { showAlert } = useAlert();
        const handleSave = async () => {
            console.log('Salvestatud kassiprofiil:', selectedCat);
            if (selectedCat) {
                await axios.put("/api/animals", selectedCat).then(() => {
                    showAlert('Success', t('saveSuccess'));
                }).catch((error) => {
                    showAlert('Error', t('saveError'));
                })
            }
        };

        return (
            <> {Object.keys(selectedCat || {}).length > 0 && (
                <div className='space-y-6'>
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
                                {t('saveAndUpdate')}
                            </Button>
                        </div>
                    </div>
                </div>)}
            </>
        );
    };

export default CatDetails;
