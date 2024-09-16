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
import { Token } from "@/types/types";
import { deleteToken } from "@/utils/apis/apis";
import { SyntheticEvent, useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";

export function DeleteDialog({ tokenId }: { tokenId: string }) {
  const handleDelete = async () => {
    await deleteToken(tokenId);
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
            onClick={handleDelete}
            className="bg-destructive hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
