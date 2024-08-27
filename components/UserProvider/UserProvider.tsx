"use client";

import { UserContext } from "../../context/userContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession();

  const initUserId = data?.user.id ? data.user.id : "";
  const [userId, setUserId] = useState(initUserId);

  useEffect(() => {
    if (data) {
      setUserId(data.user.id);
    }
  }, [data]);
  return (
    <div>
      <UserContext.Provider value={{ userId, setUserId }}>
        {children}
      </UserContext.Provider>
    </div>
  );
};

export default UserProvider;
