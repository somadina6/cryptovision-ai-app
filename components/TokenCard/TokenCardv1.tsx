import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Token } from "../../types/types";
import AddTokenDialog from "../Dialog/Dialog";
import Image from "next/image";

// A single TokenRow component using Shadcn UI TableRow and TableCell
const TokenRow = ({ token }: { token: Token }) => {
  const priceChangeColor =
    token.price_change_percentage_24h > 0
      ? "text-primary"
      : token.price_change_percentage_24h < 0
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <TableRow className="hover:bg-muted dark:hover:bg-accent transition-colors">
      <TableCell className="text-left py-2">
        <AddTokenDialog token={token} />
      </TableCell>

      {/* Token Image, Name, and Symbol */}
      <TableCell className="flex items-center py-2 text-foreground">
        <div className="rounded-full overflow-hidden mr-2">
          <Image
            src={token.image}
            alt={`${token.name} logo`}
            className="w-10 h-10"
            width={40}
            height={40}
          />
        </div>

        <div>
          <p>{token.name}</p>
          <p className="text-sm text-muted-foreground">
            {token.symbol.toUpperCase()}
          </p>
        </div>
      </TableCell>

      {/* Token Price */}
      <TableCell className="text-right py-2 text-foreground">
        ${token.current_price.toLocaleString()}
      </TableCell>

      {/* Percentage Change */}
      <TableCell className={`text-right py-2 ${priceChangeColor}`}>
        {token.price_change_percentage_24h?.toFixed(2)}%
      </TableCell>
    </TableRow>
  );
};

// Sticky Header Component using Shadcn UI TableHeader
const TokenHeader = () => {
  return (
    <TableHeader className="sticky top-0 bg-card text-card-foreground z-20">
      <TableRow>
        <TableCell scope="col"></TableCell>
        <TableCell scope="col">Name</TableCell>
        <TableCell scope="col" className="text-right">
          Price
        </TableCell>
        <TableCell scope="col" className="text-right">
          24h Change
        </TableCell>
      </TableRow>
    </TableHeader>
  );
};

// The main TokenList component using Shadcn UI Table and TableBody
const TokenList = ({ tokens }: { tokens: Token[] }) => {
  return (
    <div className="w-full bg-background text-foreground p-4 rounded-lg ">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-center mb-4">Search Results</h2>

      {/* Table */}
      <Table className="">
        {/* Sticky Header */}
        <TokenHeader />

        {/* Token Rows */}
        <TableBody>
          {tokens.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No tokens found.
              </TableCell>
            </TableRow>
          ) : (
            tokens.map((token) => <TokenRow key={token.id} token={token} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TokenList;
