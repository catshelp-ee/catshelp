import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="mb-16">
    <h1 className="text-secondary">{title}</h1>
    {children}
  </div>
);
