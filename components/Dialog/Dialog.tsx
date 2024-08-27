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

export default function AddTokenDialog({
  token,
}: {
  token: { name: string; id: string };
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Track</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add token to your portfolio</DialogTitle>
          <DialogDescription>
            Add the total quantity of the token you have here. Click save when
            you're done.
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
            <Input id="quantity" value="1000" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Track Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
