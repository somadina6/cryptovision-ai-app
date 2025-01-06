" use client";
import { ChangeEvent, useEffect, useState } from "react";
import { addToken, updateToken } from "../../utils/apis/apis";
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
import { Token } from "../../types/types";
import toast from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import {  useSWRConfig } from "swr";

export default function EditTokenAmountDialog({
  currentAmount,
  token,
}: {
  currentAmount: number;
  token: Token;
}) {
  const [tokenQuantity, setTokenQuantity] = useState<number>(currentAmount);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWRConfig();

  const handleEditToken = async () => {
    if (!tokenQuantity) return;
    if (loading) return;

    try {
      setLoading(true);
      await updateToken(token._id.toString(), tokenQuantity);
      await mutate(`fetchUserTokens`);
      toast.success("Token updated successfully");
    } catch (error) {
      console.error("Error updating token:", error);
      throw new Error("Error updating token");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setTokenQuantity(newValue ? parseFloat(newValue) : 0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p>Edit</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit token amount</DialogTitle>
          <DialogDescription>
            Add the total quantity of the token you have here. Click update when
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
                if (e.key === "Enter") handleEditToken();
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEditToken}>
            {loading ? (
              <ColorRing
                visible={true}
                height="30"
                width="30"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
