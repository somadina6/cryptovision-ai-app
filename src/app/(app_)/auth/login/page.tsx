"use client";
import ButtonPrimary2 from "@/components/Buttons/ButtonPrimary2";
import { authOptions } from "@/utils/nextauth/auth";
import axios from "axios";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function SignIn() {
  const inputStyle =
    "p-3 border rounded-sm text-sm mb-3 w-full hover:border-black";

  const fetchProviders = async () => {
    const providers = await getProviders();
    return providers;
  };

  const fetchCSRF = async (): Promise<string | undefined> => {
    const token = await axios.get<string | undefined>("/api/csrf");
    return token.data;
  };

  const { data: providers, isLoading } = useSWR("/pr", fetchProviders);
  const { data: csrfToken, isLoading: csrfloading } = useSWR("/cs", fetchCSRF);
  const router = useRouter();
  const loginHandler = async (prov: string) => {
    try {
      await signIn(prov);
      // router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-4/5 md:w-1/3 mx-auto mt-10 px-6 py-5 bg-white flex flex-col shadow-sm items-center">
      <form
        method="post"
        action="/api/auth/callback/credentials"
        className="flex flex-col items-center"
      >
        <p className="text-xl text-black mb-4">Welcome</p>
        <p className="text-xs mb-4">
          Log in to CryptoVision AI to continue to your dashboard.
        </p>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <input
          name="username"
          type="text"
          className={inputStyle}
          placeholder="Username"
        />

        <input
          name="password"
          type="password"
          className={inputStyle}
          placeholder="Password"
        />

        <ButtonPrimary2 text="Sign In" />
      </form>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <div onClick={() => loginHandler(provider.id)} className="mt-3">
              <input name="csrfToken" type="hidden" value={csrfToken} />

              <ButtonPrimary2 text={`Sign in with ${provider.name}`} />
            </div>
          </div>
        ))}
    </div>
  );
}

// export async function ff(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (session) {
//     return { redirect: { destination: "/" } };
//   }
//   console.log("getting providers");

//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//       providers: providers ?? [],
//     },
//   };
// }
