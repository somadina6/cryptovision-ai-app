"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/app/explore/search/${query}`);
    }
  };

  return (
    <Input
      type="search"
      placeholder="Search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      className="w-[250px] lg:w-[400px] xl:w-[500px]"
    />
  );
};

export default SearchBar;
