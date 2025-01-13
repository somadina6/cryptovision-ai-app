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
import toast from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import { useSWRConfig } from "swr";
import { Token } from "@/types/database";
import { addToPortfolio, getUserId } from "@/utils/supabase/queries";

export default function AddTokenDialog({ token }: { token: Token }) {
  const [tokenQuantity, setTokenQuantity] = useState<number | undefined>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWRConfig();

  const handleAddToken = async () => {
    if (!tokenQuantity) return;
    try {
      setLoading(true);
      const userId = await getUserId();
      await addToPortfolio(userId, token.id, tokenQuantity);
      await mutate(`fetchUserTokens`);
      toast.success("Token added successfully");
    } catch (error) {
      console.error("Error adding token:", error);
      throw new Error("Error adding token");
    } finally {
      setOpen(false);
      setLoading(false);
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
            <p id="name" className="col-span-3">
              {token.name}
            </p>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddToken();
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddToken}>
            {loading ? (
              <ColorRing
                visible={true}
                height="30"
                width="30"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
