"use client";

import { useEffect, useState } from "react";
import { fetchSearchResults } from "../../../../../../utils/apis/apis";
import { Container } from "postcss";
import MagnifyingGlassComp from "../../../../../../components/Loadings/MagnifyingGlass";
import TokenList from "../../../../../../components/TokenCard/TokenCardv1";
import { Token } from "../../../../../../types/types";

const Page = ({ params }: { params: { query: string } }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);

  const query = params.query;

  const handleSearch = async (q: string) => {
    try {
      const data = await fetchSearchResults(q);
      setResults(data);
    } catch (error: any) {
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  if (loading) {
    return (
      <div>
        <MagnifyingGlassComp />
        <p>Searching for tokens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="">{error}</p>
      </div>
    );
  }

  return <TokenList tokens={results} />;
};

export default Page;
