"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/store/hooks"; // Ensure this hook is properly imported
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export const ProfileDropdown = () => {
  const { name, image } = useAppSelector((state) => state.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-0 focus:ring-0">
          <img
            src={image ?? "/path-to-placeholder.jpg"}
            alt="User profile"
            className="w-8 h-8 rounded-full mr-2"
          />

          <span>{name ?? "Guest"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="cursor-pointer">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
            <p className="text-destructive hover:text-red-600 flex items-center">
              Log out
              <LogOutIcon className="w-4 h-4 ml-2" />
            </p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
