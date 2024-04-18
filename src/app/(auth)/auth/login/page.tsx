"use client";
import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ColorRing } from "react-loader-spinner";
import toast from "react-hot-toast";

type UserCredentials = {
  email: string;
  password: string;
};

export default function SignIn() {
  const inputStyle =
    "p-3 border rounded-sm text-sm mb-3 w-full hover:border-black dark:text-black";

  const initCredentials: UserCredentials = {
    email: "",
    password: "",
  };

  const router = useRouter();
  const { data: session, status } = useSession();
  const queryParams = useSearchParams();

  const [userData, setuserData] = useState<UserCredentials>(initCredentials);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.push("/app/dashboard");
    const emailFromSignUp = queryParams?.get("email");
    if (emailFromSignUp) {
      setuserData({ ...userData, email: emailFromSignUp });
    }
  }, [queryParams, status]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    setSignInLoading(true);
    event.preventDefault();
    try {
      const result = await signIn("credentials", {
        ...userData,
        redirect: false,
        callbackUrl: "/app/dashboard",
      });

      setSignInLoading(false);

      if (result?.error) {
        // toast.error(result.error, { position: "top-right" });
        setErrorMessage("Invalid Email or Password");
      }
      if (result?.ok) {
        toast.success("Sign In Successfully");
        router.push("/app/dashboard");
      }
    } catch (error: any) {
      setSignInLoading(false);

      console.error("Error signing in:", error);
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <div className="w-4/5 md:w-1/3 mx-auto mt-10 px-16 py-16 bg-white dark:bg-black flex flex-col shadow-sm items-center dark:border dark:border-white rounded-xl">
        <form
          method="post"
          className="flex flex-col items-center w-full"
          onSubmit={handleLogin}
        >
          <p className="text-xl text-black mb-4 dark:text-white">Welcome</p>
          <p className="text-xs mb-4">
            Log in to CryptoVision AI to continue to your dashboard.
          </p>

          {errorMessage && (
            <p className="text-xs mb-2 text-red-500 text-center">
              {errorMessage}!
            </p>
          )}

          <input
            name="email"
            type="email"
            value={userData.email}
            className={inputStyle}
            placeholder="Email address"
            onChange={(e) =>
              setuserData({ ...userData, email: e.target.value })
            }
          />

          <input
            name="password"
            type="password"
            value={userData.password}
            className={inputStyle}
            placeholder="Password"
            onChange={(e) =>
              setuserData({ ...userData, password: e.target.value })
            }
          />

          <Link href="/" className="w-full">
            <p className="text-blue-700 font-bold text-xs w-full text-left mb-3">
              Forgot password?
            </p>
          </Link>

          <button className="w-full bg-primary text-white py-2 rounded-md hover:opacity-95 mb-3 flex items-center justify-center h-[40px]">
            {!signInLoading ? (
              "Log In"
            ) : (
              <ColorRing
                visible={true}
                height="30"
                width="30"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            )}
          </button>
        </form>

        <p className="w-full text-left text-xs mb-3">
          Don&apos;t have an account?{" "}
          <button
            className="text-blue-700 font-bold"
            onClick={() => router.push("/auth/signup")}
          >
            Sign up
          </button>
        </p>

        <div className="flex justify-between items-center w-full mb-3">
          <hr className="w-5/12" />
          OR
          <hr className="w-5/12" />
        </div>

        <div
          onClick={() => signIn("google", { callbackUrl: "/app/dashboard" })}
          className="mt-3 font font-bold flex gap-2 border rounded-md py-3 w-full px-4 cursor-pointer hover:border-primary"
        >
          <Image
            src="/logos/google.svg"
            width={20}
            height={20}
            alt="google logo"
          />
          <p className="text-sm">Continue with Google</p>
        </div>
      </div>
    </div>
  );
}
