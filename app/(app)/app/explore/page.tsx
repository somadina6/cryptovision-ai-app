"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  Star,
  Sparkles,
  Flame,
  ChevronRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Token } from "@/types/types";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchTokens } from "@/utils/supabase/queries";
import { Skeleton } from "@/components/ui/skeleton";
import debounce from "lodash/debounce";

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchTokens(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const categories = [
    {
      name: "DeFi",
      icon: <Sparkles className="h-4 w-4" />,
      color: "bg-purple-500",
    },
    { name: "NFTs", icon: <Star className="h-4 w-4" />, color: "bg-pink-500" },
    {
      name: "Gaming",
      icon: <Flame className="h-4 w-4" />,
      color: "bg-orange-500",
    },
    {
      name: "Layer 2",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Crypto</h1>
        <p className="text-muted-foreground">
          Discover and track your favorite cryptocurrencies
        </p>
      </div>

      {/* Search Section */}
      <div className="relative">
        <div className="flex items-center space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchTerm && (isLoading || searchResults.length > 0) && (
          <Card className="absolute w-full mt-2 z-50">
            <CardContent className="p-2">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[100px]" />
                          <Skeleton className="h-4 w-[60px]" />
                        </div>
                      </div>
                    ))
                : searchResults.map((token) => (
                    <Link href={`/app/explore/${token.id}`} key={token.id}>
                      <div className="flex items-center space-x-4 p-2 hover:bg-accent rounded-md">
                        <Image
                          src={token.image}
                          alt={token.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {token.symbol.toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-auto text-right">
                          <div>${token.current_price.toLocaleString()}</div>
                          <div
                            className={`text-sm ${
                              token.price_change_percentage_24h >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {token.price_change_percentage_24h >= 0 ? "+" : ""}
                            {token.price_change_percentage_24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="hover:bg-accent transition-colors cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`${category.color} p-2 rounded-lg text-white`}
                  >
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Overview */}
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="gainers">
            <Flame className="h-4 w-4 mr-2" />
            Top Gainers
          </TabsTrigger>
          <TabsTrigger value="new">
            <Clock className="h-4 w-4 mr-2" />
            Recently Added
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending">
          <div className="grid md:grid-cols-3 gap-4">
            {searchResults.slice(0, 3).map((token) => (
              <Link href={`/app/explore/${token.id}`} key={token.id}>
                <Card className="hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={token.image}
                        alt={token.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="flex-grow">
                        <div className="font-semibold">{token.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {token.symbol.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${token.current_price.toLocaleString()}
                        </div>
                        <div
                          className={`text-sm ${
                            token.price_change_percentage_24h >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {token.price_change_percentage_24h >= 0 ? "+" : ""}
                          {token.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gainers">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Similar structure for gainers */}
          </div>
        </TabsContent>

        <TabsContent value="new">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Similar structure for new tokens */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
