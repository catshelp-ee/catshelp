import React from "react";

interface FormRadiorops {
  question: string;
  answers: string[];
  ids: string[];
  name?: string;
}

const FormRadio: React.FC<FormRadiorops> = ({
  question,
  answers,
  ids,
  name,
}) => {
  return (
    <>
      <label htmlFor="">{question}</label>
      {answers.map((answer, index) => {
        return (
          <div key={index}>
            <label htmlFor={ids[index]}>{answer}</label>
            <input type="radio" id={ids[index]} name={name} />
            {ids[index].startsWith("muu") && <textarea></textarea>}
          </div>
        );
      })}
    </>
  );
};

export default FormRadio;
