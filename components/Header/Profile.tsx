import Image from "next/image";
import React, { useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import SettingsMenu from "./SettingsMenu";
import { useAppSelector } from "@/store/hooks";

const Profile = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const userRef = useRef<HTMLDivElement>(null);

  const name = useAppSelector((state) => state.user.name);
  const status = useAppSelector((state) => state.user.status);
  const image = useAppSelector((state) => state.user.image);
  return (
    <section>
      <div>
        {/* Mobile  */}
        <div className="md:hidden cursor-pointer text-lg">
          <GiHamburgerMenu
            onClick={() => setShowSettings((prev) => !prev)}
            className="text-primary "
          />
          {showSettings && (
            <SettingsMenu setShowSettings={setShowSettings} userRef={userRef} />
          )}
        </div>

        {/* Desktop  */}
        <div
          ref={userRef}
          className="hidden md:flex items-center justify-center cursor-pointer h-6 hover:opacity-80 flex-col"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          {image ? (
            <div className="flex gap-2">
              <div className="rounded-xl overflow-hidden ">
                <Image src={image} alt="User Image" height={24} width={24} />
              </div>
              <p>{name?.split(" ")[0]}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="rounded-xl overflow-hidden ">
                <CgProfile size={24} className="text-primary" />{" "}
              </div>
              <p>{name?.split(" ")[0]}</p>
            </div>
          )}

          {/* Settings Modal  */}
          {showSettings && (
            <SettingsMenu setShowSettings={setShowSettings} userRef={userRef} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
