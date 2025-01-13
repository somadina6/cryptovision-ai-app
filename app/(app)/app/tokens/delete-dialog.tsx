"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  deleteFromPortfolio,
  getUserId,
  getUserPortfolio,
} from "@/utils/supabase/queries";
import { SyntheticEvent } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/store/hooks";
import { setUserTokens } from "@/store/features/tokenSlice";

export function DeleteDialog({ tokenId }: { tokenId: string }) {
  const dispatch = useAppDispatch();

  const handleDeleteToken = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      await deleteFromPortfolio(userId, tokenId);

      // Fetch updated tokens and update Redux store
      const updatedTokens = await getUserPortfolio(userId);
      dispatch(setUserTokens(updatedTokens));

      toast.success("Token deleted successfully");
    } catch (error) {
      console.error("Error deleting token:", error);
      toast.error("Failed to delete token");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <p className="text-red-500 hover:text-red-600">Delete</p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            token from portfolio.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onSelect={(event: SyntheticEvent) => {
              event.preventDefault();
            }}
            onClick={handleDeleteToken}
            className="bg-destructive hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
