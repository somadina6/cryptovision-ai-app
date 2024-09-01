" use client";
import { ChangeEvent, useState } from "react";
import { addToken } from "../../utils/apis/apis";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAppSelector } from "../../store/hooks";
import { Token } from "../../types/types";
import { mutate } from "swr";
import useTokens from "@/lib/useTokens";

export default function AddTokenDialog({ token }: { token: Token }) {
  const [tokenQuantity, setTokenQuantity] = useState<number | undefined>();
  const { userId } = useAppSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const handleAddToken = async () => {
    if (!userId) return;
    if (!tokenQuantity) return;
    try {
      await addToken(userId, token._id.toString(), tokenQuantity);
    } catch (error) {
      console.error("Error adding token:", error);
      throw new Error("Error adding token");
    } finally {
      setOpen(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setTokenQuantity(newValue ? parseFloat(newValue) : undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-primary hover:text-white">
          Track
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add token to your portfolio</DialogTitle>
          <DialogDescription>
            Add the total quantity of the token you have here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={token.name}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              type="number"
              id="quantity"
              value={tokenQuantity || ""}
              placeholder="1000"
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddToken}>
            Track Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
