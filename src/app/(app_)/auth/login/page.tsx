"use client";
import ButtonPrimary2 from "@/components/Buttons/ButtonPrimary2";
import toast from "react-hot-toast";
import axios from "axios";
import { getProviders, signIn, useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import useSWR from "swr";

type UserCredentials = {
  email: string;
  password: string;
};

type SignInRes = {
  error: string;
  ok: boolean;
  status: number;
  url: string | null;
};

export default function SignIn() {
  const inputStyle =
    "p-3 border rounded-sm text-sm mb-3 w-full hover:border-black";

  const initCredentials: UserCredentials = {
    email: "",
    password: "",
  };
  const [userData, setuserData] = useState(initCredentials);

  const { data: session, status } = useSession();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    toast("DD");
    event.preventDefault();
    const result = await signIn("sanity-login", {
      email: userData.email,
      password: userData.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      toast("result.error", { position: "bottom-center" });
      console.log(result.error);
    }
  };

  const fetchProviders = async () => {
    const providers = await getProviders();
    return providers;
  };

  const { data: providers, isLoading } = useSWR("/pr", fetchProviders);

  return (
    <div className="h-screen">
      <div className="w-4/5 md:w-1/3 mx-auto mt-10 px-6 py-5 bg-white dark:bg-black flex flex-col shadow-sm items-center dark:border dark:border-white rounded-xl">
        <form
          method="post"
          className="flex flex-col items-center"
          onSubmit={handleLogin}
        >
          <p className="text-xl text-black mb-4 dark:text-white">Welcome</p>
          <p className="text-xs mb-4">
            Log in to CryptoVision AI to continue to your dashboard.
          </p>

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

          <ButtonPrimary2 text="Sign In" />
        </form>

        <div
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-3"
        >
          <ButtonPrimary2 text={`Sign in with Google`} />
        </div>

        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <div
                onClick={() =>
                  signIn(provider.id, {
                    email: userData.email,
                    password: userData.password,
                    callbackUrl: "/dashboard",
                  })
                }
                className="mt-3"
              >
                {/* <input name="csrfToken" type="hidden" value={csrfToken} /> */}

                <ButtonPrimary2 text={`Sign in with ${provider.name}`} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
