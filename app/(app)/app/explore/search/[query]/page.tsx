"use client";

import { useEffect, useState } from "react";
import { fetchSearchResults } from "@/utils/apis/apis";
import MagnifyingGlassComp from "@/components/Loadings/MagnifyingGlass";
import TokenList from "@/components/TokenCard/TokenCardv1";
import { Token } from "@/types/database";

const Page = ({ params }: { params: { query: string } }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);

  const query = params.query;

  const handleSearch = async (q: string) => {
    try {
      setLoading(true);
      const data = await fetchSearchResults(q);
      setResults(data);
    } catch (error: any) {
      setError("Failed to fetch search results. Please try again.");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <MagnifyingGlassComp />
        <p className="mt-4 text-muted-foreground">Searching for tokens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return <TokenList tokens={results} />;
};

export default Page;
