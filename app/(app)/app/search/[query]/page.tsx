"use client";
import MagnifyingGlassComp from "../../../../../components/Loadings/MagnifyingGlass";
import { Token } from "../../../../../types/types";
import { fetchSearchResults } from "../../../../../utils/apis/apis";
import { useEffect, useState } from "react";
import { Container, Grid, Typography, CircularProgress } from "@mui/material";
import TokenCardv1 from "../../../../../components/TokenCard/TokenCardv1";
import TokenList from "../../../../../components/TokenCard/TokenCardv1";

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
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <MagnifyingGlassComp />
        <Typography variant="h6" component="p">
          Searching for tokens...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return <TokenList tokens={results} />;
};

export default Page;
