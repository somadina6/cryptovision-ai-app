"use client";
import { signUp } from "next-auth-sanity/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

type UserCredentials = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

const inputStyle =
  "p-3 border rounded-sm text-sm mb-3 w-full hover:border-black";

const SignUp = () => {
  const initCredentials: UserCredentials = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  };

  const router = useRouter();

  const [userData, setuserData] = useState<UserCredentials>(initCredentials);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    setSignInLoading(true);
    event.preventDefault();

    try {
      // const user = await signUp({
      //   email: userData.email,
      //   password: userData.password,
      //   name: `${userData.firstname} ${userData.lastname}`,
      // });

      const response = await axios.post("/api/user/register", {
        email: userData.email,
        password: userData.password,
        name: `${userData.firstname} ${userData.lastname}`,
      });

      if (response.status == 200) {
        toast.success(response.data.message);
        router.push(`/auth/login?email=${userData.email}`);
      }

      setSignInLoading(false);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }

      if (error.response) setErrorMessage(error.response.data.message);
      setSignInLoading(false);
    } finally {
      setSignInLoading(false);
      setuserData(userData);
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
            Sign up to CryptoVision AI to continue to your dashboard.
          </p>

          {/* {errorMessage && (
            <p className="text-xs mb-2 text-red-500 text-center">
              {errorMessage}!
            </p>
          )} */}

          <input
            name="firstname"
            type="text"
            value={userData.firstname}
            className={inputStyle}
            placeholder="First Name"
            onChange={(e) =>
              setuserData({ ...userData, firstname: e.target.value })
            }
            required
          />

          <input
            name="lastname"
            type="text"
            value={userData.lastname}
            className={inputStyle}
            placeholder="Last Name"
            onChange={(e) =>
              setuserData({ ...userData, lastname: e.target.value })
            }
            required
          />

          <input
            name="email"
            type="email"
            value={userData.email}
            className={inputStyle}
            placeholder="Email address"
            onChange={(e) =>
              setuserData({ ...userData, email: e.target.value })
            }
            required
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

          <button className="w-full bg-primary text-white py-2 rounded-md hover:opacity-95 mb-3 flex items-center justify-center h-[40px]">
            {!signInLoading ? (
              "Sign Up"
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
          Already have an account?{" "}
          <button
            className="text-blue-700 font-bold"
            onClick={() => router.push("/auth/login")}
          >
            Sign in
          </button>
        </p>

        <div className="flex justify-between items-center w-full mb-3">
          <hr className="w-5/12" />
          OR
          <hr className="w-5/12" />
        </div>

        <div
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
};

export default SignUp;
