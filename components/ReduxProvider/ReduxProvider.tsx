"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setUserStatus, clearUser } from "@/store/features/userSlice";
import {
  setUserTokens,
  setLoading,
  setError as setTokenError,
  clearTokens,
} from "@/store/features/tokenSlice";

import { getUserPortfolio, getUser } from "@/utils/supabase/queries";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/client";

function UserComp({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  // Initial profile fetch
  useEffect(() => {
    async function fetchInitialProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await getUser(session.user.id);

          dispatch(
            setUser({
              id: session.user.id,
              name: profile?.name || "",
              image: profile?.image || "",
            })
          );
          dispatch(setUserStatus("authenticated"));

          // Fetch user tokens
          dispatch(setLoading());
          const userTokens = await getUserPortfolio(session.user.id);
          dispatch(setUserTokens(userTokens || []));
        }
      } catch (error) {
        console.error("Error fetching initial profile:", error);
        // dispatch(set)
      }
    }

    fetchInitialProfile();
  }, [dispatch]);

  // Auth state change handler
  useEffect(() => {
    async function handleAuthChange(
      event: AuthChangeEvent,
      session: Session | null
    ) {
      if (event === "SIGNED_IN") {
        if (session?.user) {
          try {
            // Get user profile data
            const profile = await getUser(session.user.id);

            dispatch(
              setUser({
                id: session.user.id,
                name: profile?.name || "",
                image: profile?.image || "",
              })
            );
            dispatch(setUserStatus("authenticated"));

            // Fetch user tokens
            dispatch(setLoading());
            const userTokens = await getUserPortfolio(session.user.id);
            dispatch(setUserTokens(userTokens || []));
          } catch (error) {
            dispatch(
              setTokenError(
                error instanceof Error
                  ? error.message
                  : "Failed to fetch user data"
              )
            );
          }
        }
      } else if (event === "SIGNED_OUT") {
        dispatch(clearUser());
        dispatch(clearTokens());
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <UserComp>{children}</UserComp>
    </Provider>
  );
}
