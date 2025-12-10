import React from "react";

interface PopupProps {
    isVisible: boolean;
    slidingDown: boolean;
    slidingUp?: boolean;
    onClose?: () => void;
    title?: string;
    children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({
    isVisible,
    slidingDown,
    slidingUp,
    onClose,
    title,
    children,
}) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div
            onClick={onClose}
            className={`fixed top-16 left-1/2 transform -translate-x-1/2
    bg-slate-200 rounded-lg shadow-lg w-96 p-4 cursor-pointer z-50
    ${slidingDown ? "animate-slide-down" : ""} 
    ${slidingUp ? "animate-slide-up" : ""}
  `}
        >
            {title && <h2 className="text-lg font-semibold text-center">{title}</h2>}
            <div>{children}</div>
        </div>
    );
};

export default Popup;
