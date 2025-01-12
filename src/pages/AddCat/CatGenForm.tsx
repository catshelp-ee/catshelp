import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

interface CatGenFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const CatGenForm: React.FC<CatGenFormProps> = ({
  formData,
  setFormData,
}) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateText = async () => {
    try {
      setLoading(true);
      console.log(formData);
      const response = await axios.post("/api/gen-ai-cat", { formData });
      const generatedText = response.data.description;

      setFormData({
        ...formData,
        description: generatedText,
      });
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Pealkiri"
        name="heading"
        value={formData.heading || ""}
        onChange={handleChange}
        variant="standard"
        fullWidth
      />

      <TextField
        label="Kirjelda mõne lausega kassi iseloomu või kasuta AI abi "
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        className="w-full p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2  focus:border-transparent resize-none"
        variant="standard"
        fullWidth
        multiline
      />
      <Button
        onClick={handleGenerateText}
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Laeb..." : "Kasuta AI-d"}
      </Button>
    </div>
  );
};
