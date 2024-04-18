"use client";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status == "authenticated") {
    const { id, email, name } = session.user;
    const firstName = name ? name.split(" ")[0] : "User";

    return (
      <div>
        <div>
          <h3>Welcome {firstName}!</h3>
          <h4>Your portfolio is up by 5%</h4>
        </div>
      </div>
    );
  } else {
    router.push("/auth/login");
  }
};

export default Page;
