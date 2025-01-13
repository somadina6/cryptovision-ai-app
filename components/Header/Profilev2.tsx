"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/supabase/auth";
import { clearUser } from "@/store/features/userSlice";
import { clearTokens } from "@/store/features/tokenSlice";

export const ProfileDropdown = () => {
  const { name, image, status } = useAppSelector((state) => state.user);
  const firstName = name?.split(" ")[0];
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      dispatch(clearUser());
      dispatch(clearTokens());
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (status === "loading")
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    );

  if (status === "authenticated")
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-0 focus:ring-0 focus:outline-none focus-visible:ring-0"
          >
            {image ? (
              <Image
                src={image}
                alt="User profile"
                className="w-8 h-8 rounded-full mr-2"
                width={32}
                height={32}
              />
            ) : (
              <CgProfile className="w-6 h-6 mr-2" />
            )}
            <span className="hidden md:block">{firstName ?? "Guest"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24" align="end">
          <DropdownMenuGroup className="cursor-pointer">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
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
