import React, { useState } from "react";
import { multiStepForm } from "./MultiStepForm.tsx";
import { PrimaryForm } from "./PrimaryForm.tsx";
import { SecondaryForm } from "./SecondaryForm.tsx";
import { PersonalityForm } from "./PersonalityForm.tsx";
import { Stack, Button } from "@mui/material";
import Header from "../Header.tsx";
import Sidebar from "../Dashboard/Sidebar.tsx";

const AddCat: React.FC = () => {
  const [formData, setFormData] = useState({
    //Primary Form
    rescueId: "",
    color: "",
    name: "",
    location: "",
    gender: "",
    dateOfBirth: "",
    image: null,

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
  });

  const { step, isFirstStep, isLastStep, next, back } = multiStepForm([
    <PrimaryForm formData={formData} setFormData={setFormData} />,
    <SecondaryForm formData={formData} setFormData={setFormData} />,
    <PersonalityForm formData={formData} setFormData={setFormData} />,
  ]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("form to be submitted", formData);
  };

  return (
    <div>
      <div className="flex flex-col w-full h-full">
        <Header />
        <div className="mt-6 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <Sidebar />
            <div className="flex-1 flex flex-col  max-w-3xl mx-auto max-md:ml-0 max-md:w-full text-left mb-3">
              <div className="mb-3">{step}</div>

              <Stack spacing={2} direction="row">
                {!isFirstStep && (
                  <Button onClick={back} variant="outlined">
                    Tagasi
                  </Button>
                )}
                {!isLastStep ? (
                  <Button onClick={next} variant="contained">
                    Edasi
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                  >
                    Saada
                  </Button>
                )}
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCat;
