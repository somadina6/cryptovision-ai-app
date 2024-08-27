import React, { ReactNode } from "react";

type BackdropProps = {
  isOpen: boolean;
  children?: ReactNode;
};

const Backdrop: React.FC<BackdropProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed z-10 top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
      {children}
    </div>
  );
};

export default Backdrop;
