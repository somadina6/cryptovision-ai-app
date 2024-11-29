"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import { Token } from "@/types/types"
import Image from "next/image";

interface ExplorePageProps {
  tokens: Token[];
}

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const tokens: Token[] = []
    

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Input 
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button variant="outline" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Top Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {filteredTokens.slice(0, 3).map((token) => (
              <Link href={`/explore/${token.id}`} key={token.id}>
                <Card className="hover:bg-accent transition-colors">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Image 
                      src={token.image} 
                      alt={token.name} 
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                    />
                    <div className="flex-grow">
                      <div className="font-semibold">{token.name}</div>
                      <div className="text-muted-foreground">{token.symbol.toUpperCase()}</div>
                    </div>
                    <div className="text-right">
                      <div>${token.current_price.toLocaleString()}</div>
                      <div className={`text-sm ${token.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {token.price_change_percentage_24h > 0 ? '+' : ''}
                        {token.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}