"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { fetchSearchResults } from "@/utils/apis/apis"; // Assuming you have a search API
import { Token } from "@/types/types";
import Image from "next/image";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Token[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (searchTerm.trim().length > 1) {
      fetchSearchResults(searchTerm)
        .then((results) => {
          setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
        })
        .catch((error) => {
          console.error("Search suggestions error:", error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  }, []);

  // Debounce effect to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/app/explore/search/${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (tokenId: string) => {
    router.push(`/app/explore/${tokenId}`);
    setQuery("");
    setSuggestions([]);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-[500px]">
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" 
        />
        <Input
          type="search"
          placeholder="Search tokens..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 w-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
          {suggestions.map((token) => (
            <div
              key={token.id}
              onClick={() => handleSuggestionClick(token.id)}
              className="flex items-center p-2 hover:bg-accent cursor-pointer"
            >
              <Image 
                src={token.image} 
                alt={token.name} 
                className="w-6 h-6 rounded-full mr-3" 
              />
              <div>
                <div className="font-semibold">{token.name}</div>
                <div className="text-xs text-muted-foreground">
                  {token.symbol.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;