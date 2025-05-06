import React from "react";

interface CatInfoProps {
  label: string;
  value?: string;
}

const CatInfoField: React.FC<CatInfoProps> = ({ label, value }) => (
  <div className="flex flex-col mt-2">
    <div className="text-sm font-bold">{label}</div>
    <div className="text-sm">{value || "-"}</div>
  </div>
);

export default CatInfoField;
