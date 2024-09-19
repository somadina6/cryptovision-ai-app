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

import { deleteToken } from "@/utils/apis/apis";
import { SyntheticEvent } from "react";
import { useSWRConfig } from "swr";

export function DeleteDialog({ tokenId }: { tokenId: string }) {
  const { mutate } = useSWRConfig();

  const handleDeleteToken = async () => {
    try {
      await deleteToken(tokenId);
      await mutate(`fetchUserTokens`);
    } catch (error) {
      console.error("Error deleting token:", error);
      throw new Error("Error deleting token");
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
