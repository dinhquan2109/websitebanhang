import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { SHOP_NAME } from "@/constants/shop";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { setUserSession } from "@/store/reducers/user";
import { mapSupabaseSession, mapSupabaseUser } from "@/utils/auth";
import { toAuthErrorMessage } from "@/utils/supabase-auth-errors";

import Layout from "../layouts/Main";

type LoginMail = {
  email: string;
  password: string;
  keepSigned?: boolean;
};

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginMail>();

  const onSubmit = async (data: LoginMail) => {
    setApiError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setApiError(
          "Chưa cấu hình Supabase trên website. Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY trên Vercel rồi redeploy.",
        );
        return;
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      if (error) {
        setApiError(toAuthErrorMessage(error.message));
        return;
      }

      if (!authData.user) {
        setApiError(
          "Đăng nhập chưa hoàn tất. Kiểm tra email xác nhận trong Supabase hoặc tắt Confirm email.",
        );
        return;
      }

      dispatch(
        setUserSession({
          user: mapSupabaseUser({
            id: authData.user.id,
            email: authData.user.email,
            user_metadata: authData.user.user_metadata as {
              first_name?: string;
              last_name?: string;
            },
          }),
          session: mapSupabaseSession(authData.session),
        }),
      );

      await router.push("/products");
    } catch {
      setApiError("Không thể đăng nhập. Thử lại sau hoặc kiểm tra kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/products">
              <i className="icon-left" />
              Quay lại cửa hàng
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">Đăng nhập</h2>
            <p className="form-block__description">
              Đăng nhập tài khoản {SHOP_NAME}. Nếu vừa đăng ký mà không vào được,
              hãy xác nhận email trong hộp thư trước.
            </p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {apiError && (
                <p className="message message--error" role="alert">
                  {apiError}
                </p>
              )}
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: true,
                    pattern: emailPattern,
                  })}
                />

                {errors.email?.type === "required" && (
                  <p className="message message--error">
                    Vui lòng nhập trường này
                  </p>
                )}

                {errors.email?.type === "pattern" && (
                  <p className="message message--error">
                    Vui lòng nhập email hợp lệ
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  type="password"
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                  {...register("password", { required: true })}
                />
                {errors.password?.type === "required" && (
                  <p className="message message--error">
                    Vui lòng nhập trường này
                  </p>
                )}
              </div>

              <div className="form__info">
                <div className="checkbox-wrapper">
                  <label
                    htmlFor="check-signed-in"
                    className="checkbox checkbox--sm"
                  >
                    <input
                      type="checkbox"
                      id="check-signed-in"
                      {...register("keepSigned")}
                    />
                    <span className="checkbox__check" />
                    <p>Duy trì đăng nhập</p>
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="form__info__forgot-password"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <p className="form__signup-link">
                Chưa có tài khoản? <Link href="/register">Đăng ký</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
