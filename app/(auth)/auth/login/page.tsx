"use client";

import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ColorRing } from "react-loader-spinner";
import toast from "react-hot-toast";

type UserCredentials = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      setLoading(false);

      if (!result) {
        toast.error("An error occurred");
        return;
      }

      if (result.ok) {
        toast.success("Successfully logged in");
        const callbackUrl = searchParams?.get("callbackUrl") || "/";
        router.push(callbackUrl);
      } else {
        toast.error(result.error || "An error occurred");
      }
    },
    [credentials, router, searchParams]
  );

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <ColorRing /> : "Sign In"}
        </button>
      </form>
      <Link href="/auth/register">Register</Link>
    </div>
  );
};

LoginPage.displayName = "LoginPage";

export default LoginPage;
