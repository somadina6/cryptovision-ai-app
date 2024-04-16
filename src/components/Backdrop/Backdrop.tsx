import React, { FC } from "react";

type Props = {
  isOpen: boolean;
};
const Backdrop: FC<Props> = ({ isOpen }) => {
  return isOpen ? (
    <div className="fixed z-[10] top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.8)]"></div>
  ) : (
    <></>
  );
};
export default Backdrop;
