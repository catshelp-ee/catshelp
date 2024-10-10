import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

interface Question {
  index: number;
  text: string;
}

const EditableQuestion = styled(TextField)(({ theme }) => ({
  ".MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none", // Remove the default border
    },
    "&:hover fieldset": {
      border: "none", // Prevent border from appearing on hover
    },
    "& input": {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#000", // Use primary color for default text
      padding: 0, // Remove padding for a clean look
    },
    "&.Mui-focused input": {
      background: "#e8e8e8", // Change to secondary color on hover
    },
  },
}));

const FormEditor = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState("Default Question?");
  const [answer, setAnswer] = useState("");

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleAnswerChange = (event: any) => {
    setAnswer(event.target.value);
  };

  const addQuestion = () => {
    setQuestions((existingQuestions) => [
      ...existingQuestions,
      {
        index: existingQuestions.length + 1,
        text: "Edit question",
      },
    ]);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert(`Question: ${question}\nAnswer: ${answer}`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-scroll">
      <Button onClick={addQuestion}>LISA KÜSIMUS</Button>
      {questions.map((question, index) => {
        return (
          <Box
            key={index}
            id={String(index)}
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 400,
              marginBottom: 8,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{ marginRight: 1, fontSize: 24, fontWeight: "bold" }}
              >
                {index + 1}.
              </Typography>
              <EditableQuestion
                variant="outlined"
                value={question.text}
                onChange={handleQuestionChange}
              />
            </Box>

            <TextField
              label="Your Answer"
              variant="outlined"
              value={answer}
              onChange={handleAnswerChange}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        );
      })}
    </div>
  );
};

export default FormEditor;
