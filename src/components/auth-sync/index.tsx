import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { RootState } from "@/store";
import { setUserSession } from "@/store/reducers/user";
import { mapSupabaseSession, mapSupabaseUser } from "@/utils/auth";

/** Đồng bộ phiên Supabase (localStorage) vào Redux sau khi tải trang. */
const AuthSync = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    const loadProfileRole = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      return (data?.role as "user" | "admin" | undefined) ?? "user";
    };

    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const role = await loadProfileRole(data.session.user.id);
        dispatch(
          setUserSession({
            user: {
              ...mapSupabaseUser({
                id: data.session.user.id,
                email: data.session.user.email,
                user_metadata: data.session.user.user_metadata as {
                  first_name?: string;
                  last_name?: string;
                },
              }),
              role,
            },
            session: mapSupabaseSession(data.session),
          }),
        );
      }
    };

    if (!user) {
      void sync();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        if (session?.user) {
          const role = await loadProfileRole(session.user.id);
          dispatch(
            setUserSession({
              user: {
                ...mapSupabaseUser({
                  id: session.user.id,
                  email: session.user.email,
                  user_metadata: session.user.user_metadata as {
                    first_name?: string;
                    last_name?: string;
                  },
                }),
                role,
              },
              session: mapSupabaseSession(session),
            }),
          );
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, [dispatch, user]);

  return null;
};

export default AuthSync;
