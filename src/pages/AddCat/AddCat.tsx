import React, { useState } from "react";
import { multiStepForm } from "./MultiStepForm.tsx";
import { PrimaryForm } from "./PrimaryForm.tsx";
import { SecondaryForm } from "./SecondaryForm.tsx";
import { PersonalityForm } from "./PersonalityForm.tsx";
import { Stack, Button } from "@mui/material";
import Header from "../Header.tsx";
import Sidebar from "../Dashboard/Sidebar.tsx";

const AddCat: React.FC = () => {
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
  });

  const { currentStepIndex, step, isFirstStep, isLastStep, next, back, steps } =
    multiStepForm([
      <PrimaryForm formData={formData} setFormData={setFormData} />,
      <SecondaryForm formData={formData} setFormData={setFormData} />,
      <PersonalityForm formData={formData} setFormData={setFormData} />,
    ]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //TODO: some input validation before sending off
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
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                  }}
                ></div>
              </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCat;
