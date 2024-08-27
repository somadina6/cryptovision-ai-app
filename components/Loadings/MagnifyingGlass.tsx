import React from "react";
import { MagnifyingGlass } from "react-loader-spinner";

const MagnifyingGlassComp = () => {
  return (
    <div className="mx-auto w-[100px]">
      <MagnifyingGlass
        visible={true}
        height="100"
        width="100"
        ariaLabel="magnifying-glass-loading"
        wrapperStyle={{}}
        wrapperClass="magnifying-glass-wrapper"
        glassColor="#c0efff"
        color="#e15b64"
      />
    </div>
  );
};

export default MagnifyingGlassComp;
