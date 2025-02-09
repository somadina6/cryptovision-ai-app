"use client";
import { supabase } from "@/utils/supabase/client";
import { Dispatch, FC, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  setShowSettings: Dispatch<React.SetStateAction<boolean>>;
  showSettings?: boolean;
  userRef: React.RefObject<HTMLDivElement>;
};

const SettingsMenu: FC<Props> = ({
  showSettings,
  setShowSettings,
  userRef,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: any) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        userRef.current &&
        !userRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    },
    [userRef, setShowSettings, ref]
  );

  useEffect(() => {
    // Add click outside event listener when the component mounts
    document.body.addEventListener("mousedown", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div
      ref={ref}
      className="border absolute top-14 py-1 px-2 rounded sm:right-6 md:right-auto z-10 dark:bg-black"
    >
      <ul>
        <li className="p-1 hover:text-primary">Profile</li>
        <li
          onClick={handleSignOut}
          className="hover:text-red-500 p-1 rounded-md"
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default SettingsMenu;
