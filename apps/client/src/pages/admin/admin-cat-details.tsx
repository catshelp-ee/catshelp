import type { Profile } from '@catshelp/types/src/index.ts';
import { calculateAge, isFutureDate } from '@catshelp/utils/src/index.ts';
import { useIsMobile } from '@context/is-mobile-context.tsx';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface CatDetailsProps {
  selectedCat: Profile;
}

const CatDetailsHeader: React.FC<{
  title: string;
}> = ({ title }) => (
  <div className="profile-section">
    <h4 className="section-header">PEALKIRI</h4>
    <span className="section-value">{title}</span>
  </div>
);

const CatDescription: React.FC<{ description: string }> = ({ description }) => (
  <div className="profile-section">
    <h4 className="section-header">LOOMA KIRJELDUS</h4>
    <Typography sx={{ textAlign: 'justify' }}>{description}</Typography>
  </div>
);

const CatDetails: React.FC<{ selectedCat: Profile }> = ({ selectedCat }) => {
  const capitalize = (str) => {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="profile-section">
      <h4 className="section-header">LOOMA PROFIIL</h4>

      <span className="section-label">Kassi sugu</span>
      <span className="section-value">
        {capitalize(selectedCat.mainInfo.gender)}
      </span>

      <span className="section-label">Kassi vanus</span>
      <span className="section-value">
        {calculateAge(selectedCat.mainInfo.birthDate)}
      </span>

      <span className="section-label">Kassi välimus</span>
      <span className="section-value">
        {[selectedCat.mainInfo.coatColour, selectedCat.mainInfo.coatLength]
          .filter(Boolean)
          .join(' ')}
      </span>

      <span className="section-label">Kassi asukoht</span>
      <span className="section-value">{selectedCat.mainInfo.location}</span>

      <div className="seperator">TODO</div>

      <span className="section-label">
        Mis protseduurid hoiulisel tehtud on?
      </span>
      <span className="section-value">{extractProcedures(selectedCat)}</span>

      <span className="section-label">Lõigatud</span>
      <span className="section-value">TODO</span>

      <span className="section-label">
        Kui kassil esineb krooniline haigus, vajab eritoitu või on vigastus
        palun kirjuta siia sellest
      </span>
      <span className="section-value">
        {selectedCat.mainInfo.chronicConditions}
      </span>

      <span className="section-label">
        Kui kaua on kass hoiukodus/kassitoas viibinud?
      </span>
      <span className="section-value">
        {selectedCat.mainInfo.fosterStayDuration}
      </span>

      <div className="seperator">TODO</div>

      <span className="section-label">Iseloom</span>
      <span className="section-value">
        {selectedCat.characteristics.multiselectFields.personality.join(', ')}
      </span>

      <span className="section-label">Kassile meeldib</span>
      <span className="section-value">
        {selectedCat.personalityInfo.likes.join(', ')}
      </span>

      <span className="section-label">
        Kirjelda kassi mõne iseloomustava lausega (nt milline on kiisu argipäev)
      </span>
      <span className="section-value">{selectedCat.mainInfo.description}</span>

      <span className="section-label">Kuidas suhtub teistesse kassidesse?</span>
      <span className="section-value">
        {selectedCat.personalityInfo.attitudeTowardsCats}
      </span>

      <span className="section-label">Kuidas suhtub koertesse?</span>
      <span className="section-value">
        {selectedCat.personalityInfo.attitudeTowardsDogs}
      </span>

      <span className="section-label">Kuidas suhtub lastesse?</span>
      <span className="section-value">
        {selectedCat.personalityInfo.attitudeTowardsChildren}
      </span>

      <span className="section-label">
        Kuidas ta sobiks toa- või õuekassikas?
      </span>
      <span className="section-value">
        {selectedCat.personalityInfo.suitabilityForIndoorOrOutdoor}
      </span>
    </div>
  );
};

const extractProcedures = (profile: Profile): string => {
  const procedures = [];

  if (!profile.mainInfo.spayedOrNeutered) {
    procedures.push('Lõigatud');
  }

  if (isFutureDate(profile.nextComplexVaccineDate)) {
    procedures.push('Kompleksvaktsiin');
  }

  if (isFutureDate(profile.vaccineInfo.nextRabiesVaccineDate)) {
    procedures.push('Marutaudi vaktsiin');
  }

  if (profile.vaccineInfo.dewormingOrFleaTreatmentDate) {
    procedures.push('Ussirohi');
  }

  return procedures.join(', ');
};

const AdminCatDetails: React.FC<CatDetailsProps> = ({ selectedCat }) => {
  const isMobile = useIsMobile();
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(
    selectedCat.profilePictureFilename,
  );

  const capitalize = (str) => {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    selectedCat.profilePictureFilename = selectedProfilePicture;
  }, [selectedProfilePicture]);

  return (
    <>
      <div className={`${isMobile ? 'w-full' : 'w-2/3'}`}>
        <CatDetailsHeader title={selectedCat?.mainInfo.name || ''} />
        <CatDescription description={selectedCat?.mainInfo.description || ''} />

        <CatDetails selectedCat={selectedCat} />
      </div>
    </>
  );
};

export default AdminCatDetails;
