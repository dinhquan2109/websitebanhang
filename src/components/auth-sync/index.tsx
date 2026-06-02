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

    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        dispatch(
          setUserSession({
            user: mapSupabaseUser({
              id: data.session.user.id,
              email: data.session.user.email,
              user_metadata: data.session.user.user_metadata as {
                first_name?: string;
                last_name?: string;
              },
            }),
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
      if (session?.user) {
        dispatch(
          setUserSession({
            user: mapSupabaseUser({
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata as {
                first_name?: string;
                last_name?: string;
              },
            }),
            session: mapSupabaseSession(session),
          }),
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, user]);

  return null;
};

export default AuthSync;
