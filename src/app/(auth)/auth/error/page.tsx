"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    ""
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const errorMessages = searchParams.get("error");
      setErrorMessage(errorMessages);
    }
  }, [searchParams]);
  return (
    <div>
      <h3>{errorMessage}</h3>
    </div>
  );
};

export default Page;
