import { Profile } from "@catshelp/types/src";
import { calculateAge, isFutureDate } from "@catshelp/utils/src";
import { useIsMobile } from "@context/is-mobile-context";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageGallery from "./image-gallery";

interface CatDetailsProps {
    selectedCat: Profile;
}

const CatDetailsHeader: React.FC<{
    title: string;
}> = ({ title }) => (
    <div className="profile-section">
        <h4 className="section-header">PEALKIRI</h4>
        <span className="section-value">
            {title}
        </span>
    </div>
);

const CatDescription: React.FC<{ description: string }> = ({ description }) => (
    <div className="profile-section">
        <h4 className="section-header">LOOMA KIRJELDUS</h4>
        <Typography sx={{ textAlign: "justify" }}>{description}</Typography>
    </div>
);

const CatProfile: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => {

    const capitalize = str => {
        if (!str) {
            return ""
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    };

    return (
        <div className="profile-section">
            <h4 className="section-header">LOOMA PROFIIL</h4>
            
            <span className="section-label">Kassi sugu</span>
            <span className="section-value">{capitalize(selectedCat.characteristics.textFields.gender)}</span>

            <span className="section-label">Kassi vanus</span>
            <span className="section-value">{calculateAge(selectedCat.mainInfo.birthDate)}</span>

            <span className="section-label">Kassi välimus</span>
            <span className="section-value">{
                [
                    selectedCat.characteristics.selectFields.coatColour,
                    selectedCat.characteristics.selectFields.coatLength
                ].filter(Boolean).join(' ')}
            </span>

            <span className="section-label">Kassi asukoht</span>
            <span className="section-value">{selectedCat.mainInfo.location}</span>

            <div className="seperator">TODO</div>


            <span className="section-label">Mis protseduurid hoiulisel tehtud on?</span>
            <span className="section-value">{extractProcedures(selectedCat)}</span>

            <span className="section-label">Lõigatud</span>
            <span className="section-value">TODO</span>

            <span className="section-label">Kui kassil esineb krooniline haigus, vajab eritoitu või on vigastus palun kirjuta siia sellest</span>
            <span className="section-value">{selectedCat.characteristics.textFields.chronicConditions}</span>

            <span className="section-label">Kui kaua on kass hoiukodus/kassitoas viibinud?</span>
            <span className="section-value">{selectedCat.characteristics.textFields.fosterStayDuration}</span>

            <div className="seperator">TODO</div>


            <span className="section-label">Iseloom</span>
            <span className="section-value">{selectedCat.characteristics.multiselectFields.personality.join(", ")}</span>

            <span className="section-label">Kassile meeldib</span>
            <span className="section-value">{selectedCat.characteristics.multiselectFields.likes.join(", ")}</span>

            <span className="section-label">Kirjelda kassi mõne iseloomustava lausega (nt milline on kiisu argipäev)</span>
            <span className="section-value">{selectedCat.characteristics.textFields.description}</span>

            <span className="section-label">Kuidas suhtub teistesse kassidesse?</span>
            <span className="section-value">{selectedCat.characteristics.selectFields.attitudeTowardsCats}</span>

            <span className="section-label">Kuidas suhtub koertesse?</span>
            <span className="section-value">{selectedCat.characteristics.selectFields.attitudeTowardsDogs}</span>

            <span className="section-label">Kuidas suhtub lastesse?</span>
            <span className="section-value">{selectedCat.characteristics.selectFields.attitudeTowardsChildren}</span>

            <span className="section-label">Kuidas ta sobiks toa- või õuekassikas?</span>
            <span className="section-value">{selectedCat.characteristics.selectFields.suitabilityForIndoorOrOutdoor}</span>
        </div>
    );
};

const extractProcedures = (profile: Profile): string => {
    const procedures = [];

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

    return procedures.join(', ');
}

const CatDetails: React.FC<CatDetailsProps> = ({
    selectedCat,
}) => {
    const isMobile = useIsMobile();
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(selectedCat.profilePictureFilename);

    const capitalize = str => {
        if (!str) {
            return ""
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    };

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

    useEffect(() => {
        selectedCat.profilePictureFilename = selectedProfilePicture;
    }, [selectedProfilePicture])
    

    return (
        <>
            {isMobile && (
                <ImageGallery animalId={selectedCat.animalId} profilePictureState={{selectedProfilePicture, setSelectedProfilePicture}} images={selectedCat?.images || []} />
            )}
            <div className={`${isMobile ? "w-full" : "w-2/3"}`}>
                <CatDetailsHeader
                    title={selectedCat?.mainInfo.name || ""}
                />

                <CatDescription description={selectedCat?.description || ""} />
                <CatProfile selectedCat={selectedCat}/>
            </div>
            {!isMobile && <ImageGallery animalId={selectedCat.animalId} profilePictureState={{selectedProfilePicture, setSelectedProfilePicture}} name={selectedCat.mainInfo.name} images={selectedCat?.images || []} />}
        </>
    );
};

export default CatDetails;
