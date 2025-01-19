import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EditTokenAmountDialog from "@/components/Dialog/EditTokenAmountDialog";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Token } from "@/types/database";
import { DeleteDialog } from "@/app/(app)/app/tokens/delete-dialog";
import { useAppSelector } from "@/store/hooks";
import AddTokenDialog from "@/components/Dialog/Dialog";

interface FinancialMetricsProps {
  token: Token;
}

export function FinancialMetrics({ token }: FinancialMetricsProps) {
  const { userTokens, status } = useAppSelector((state) => state.token);

  // Find user's holding of this token
  const userHolding = userTokens?.find((t) => t.token.id === token.id);

  if (status === "loading" || status === "idle") {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  if (!userHolding) {
    return (
      <Card>
        <CardContent className="text-center space-y-4 py-8">
          <p className="text-muted-foreground">
            Add this token to your portfolio to see financial metrics
          </p>
          <AddTokenDialog token={token} />
        </CardContent>
      </Card>
    );
  }

  const quantity = userHolding.amount;
  const currentValue = quantity * token.current_price;
  const athValue = quantity * token.ath;
  const atlValue = quantity * token.atl;

  // Calculate potential gains/losses
  const toATHGain = athValue - currentValue;
  const toATHPercentage = (athValue / currentValue - 1) * 100;
  const fromATLGain = currentValue - atlValue;
  const fromATLPercentage = (currentValue / atlValue - 1) * 100;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Your Position
                </h3>
                <div className="text-2xl font-bold">
                  ${currentValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {quantity.toLocaleString()} {token.symbol.toUpperCase()}
                </div>
              </div>
              <div className="flex gap-2 h-full items-center self-center text-sm">
                <Button variant="outline" size="lg" className="h-8 w-8">
                  <EditTokenAmountDialog
                    token={userHolding}
                    currentAmount={quantity}
                  />
                </Button>

                <Button variant="destructive" size="lg" className="h-8 w-8">
                  <DeleteDialog tokenId={token.id} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Potential ATH Value
            </h3>
            <div className="text-2xl font-bold text-green-600">
              ${athValue.toLocaleString()}
            </div>
            <div className="text-sm text-green-600">
              +${toATHGain.toLocaleString()} ({toATHPercentage.toFixed(2)}%)
            </div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Current Price</TableCell>
            <TableCell className="text-right">${token.current_price}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Holdings Value</TableCell>
            <TableCell className="text-right">
              ${currentValue.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>All-Time High Value</TableCell>
            <TableCell className="text-right text-green-600">
              ${athValue.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>All-Time Low Value</TableCell>
            <TableCell className="text-right text-red-600">
              ${atlValue.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gain from ATL</TableCell>
            <TableCell className="text-right text-green-600">
              +${fromATLGain.toLocaleString()} ({fromATLPercentage.toFixed(2)}%)
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>To ATH Potential</TableCell>
            <TableCell className="text-right text-green-600">
              +${toATHGain.toLocaleString()} ({toATHPercentage.toFixed(2)}%)
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
