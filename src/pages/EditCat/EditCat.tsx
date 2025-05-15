import React, { useState } from "react";
import { multiStepForm } from "@pages/EditCat/MultiStepForm.tsx";
import { PrimaryForm } from "@pages/EditCat/PrimaryForm.tsx";
import { SecondaryForm } from "@pages/EditCat/SecondaryForm.tsx";
import { PersonalityForm } from "@pages/EditCat/PersonalityForm.tsx";
import { CatGenForm } from "@pages/EditCat/CatGenForm.tsx";
import { Button } from "@mui/material";

const EditCat: React.FC = () => {
  //TODO: use Cat interfaces defaultCat
  const [formData, setFormData] = useState({
    //Primary Form
    rescueId: "",
    color: "",
    name: "",
    location: "",
    gender: "",
    dateOfBirth: "",
    images: [],

    //secondary form
    chipId: "",
    furLength: "",
    rescueDate: "",
    chronicIllnesses: "",
    timeInFosterCare: "",
    rescueHistory: "",
    additionalNotes: "",

    // personality Form
    personality: [],
    likes: [],
    otherTraits: [],
    dailyRoutine: "",
    interactionWithCats: "",
    interactionWithDogs: "",
    interactionWithChildren: "",
    type: "",

    //gen Form
    description: "",
    heading: "",
  });

  const { currentStepIndex, step, isFirstStep, isLastStep, next, back, steps } =
    multiStepForm([
      <PrimaryForm formData={formData} setFormData={setFormData} />,
      <SecondaryForm formData={formData} setFormData={setFormData} />,
      <PersonalityForm formData={formData} setFormData={setFormData} />,
      <CatGenForm formData={formData} setFormData={setFormData} />,
    ]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //TODO: some input validation before sending off
    console.log("form to be submitted", formData);
  };

  return (

    <div className="flex-1 flex flex-col  max-w-3xl mx-auto max-md:ml-0 max-md:w-full text-left mb-3">
      <div className="mb-3">{step}</div>

      <div className="flex justify-between items-center mt-4">
        {!isFirstStep && (
          <Button
            onClick={back}
            variant="outlined"
            className="flex-grow-0 flex-shrink-0"
          >
            Tagasi
          </Button>
        )}

        <div className="flex-grow"></div>

        {!isLastStep ? (
          <Button
            onClick={next}
            variant="contained"
            className="flex-grow-0 flex-shrink-0"
          >
            Edasi
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            className="flex-grow-0 flex-shrink-0"
          >
            Saada
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditCat;
