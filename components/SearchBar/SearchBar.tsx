"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/app/search/${query}`);
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search"
        className="border border-border w-full p-2 md:py-2 md:px-4 rounded-full text-md bg-transparent dark:text-white text-input focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
    </div>
  );
};

export default SearchBar;
