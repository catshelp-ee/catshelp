import React, { forwardRef } from "react";
import { Avatar, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { Pet } from "./Dashboard";

interface AllPetsPopupProps {
  pets: Pet[];
  onClose?: () => void;
  isOpen?: boolean;
}

// Individual Pet Item Component
const PetItem: React.FC<{ pet: Pet }> = ({ pet }) => {
  const theme = useTheme();
  
  return (
    <Link
      to={`/cat-profile`}
      className="flex justify-between items-center px-6 py-3 text-inherit bg-transparent transition-colors duration-200 hover:bg-black/5 focus:bg-black/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      aria-label={`Vaata ${pet.name} profiili`}
    >
      <div className="flex items-center space-x-4">
        <Avatar
          src={`/${pet.image}`}
          alt={`${pet.name} pilt`}
          sx={{ 
            width: 48, 
            height: 48,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 500,
            color: theme.palette.text.primary,
            fontSize: '0.95rem'
          }}
        >
          {pet.name}
        </Typography>
      </div>
    </Link>
  );
};

// Popup Header Component
const PopupHeader: React.FC<{ totalCount: number }> = ({ totalCount }) => {
  const theme = useTheme();
  
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: '1.1rem'
        }}
      >
        Kõik hoiuloomad ({totalCount})
      </Typography>
    </div>
  );
};

const AllPetsPopup = forwardRef<HTMLDivElement, AllPetsPopupProps>(
  ({ pets, onClose, isOpen }, ref) => {
    const theme = useTheme();

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="absolute w-full bg-white z-10 max-h-96 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Hoiuloomade nimekiri"
        style={{
          boxShadow: theme.shadows[8]
        }}
      >
        <PopupHeader totalCount={pets.length} />
        
        <div className="flex-1 overflow-y-scroll">
          {pets.map((pet, id) => (
            <PetItem key={id} pet={pet} />
          ))}
        </div>
        
        {onClose && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label="Sulge popup"
            >
              Sulge
            </button>
          </div>
        )}
      </div>
    );
  }
);

AllPetsPopup.displayName = "AllPetsPopup";

export default AllPetsPopup;