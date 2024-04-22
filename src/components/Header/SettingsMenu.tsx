"use client";
import { signOut } from "next-auth/react";
import { Dispatch, FC, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

type Props = {
  setShowSettings: Dispatch<React.SetStateAction<boolean>>;
  showSettings?: boolean;
};
const SettingsMenu: FC<Props> = ({ showSettings, setShowSettings }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: any) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShowSettings(false);
    }
  }, []);

  useEffect(() => {
    // Add click outside event listener when the component mounts
    document.body.addEventListener("mousedown", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      ref={ref}
      className="border absolute top-14 py-1 px-2 rounded sm:right-6 md:right-auto z-10 dark:bg-black"
    >
      <ul>
        <li className="p-1 hover:text-primary">Profile</li>
        <li
          onClick={() => signOut({ callbackUrl: "/" })}
          className="hover:text-red-500  p-1 rounded-md"
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default SettingsMenu;
