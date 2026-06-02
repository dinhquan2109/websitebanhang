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

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
};

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    setApiError(null);
    setApiSuccess(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setApiError(
          "Chưa cấu hình Supabase. Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY trên Vercel.",
        );
        return;
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (error) {
        setApiError(toAuthErrorMessage(error.message));
        return;
      }

      if (authData.session && authData.user) {
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
        return;
      }

      setApiSuccess(
        "Đã gửi email xác nhận (nếu Supabase bật Confirm email). Kiểm tra hộp thư rồi đăng nhập.",
      );
    } catch {
      setApiError("Đăng ký thất bại. Vui lòng thử lại.");
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
            <h2 className="form-block__title">
              Tạo tài khoản và khám phá ưu đãi
            </h2>
            <p className="form-block__description">
              Đăng ký tài khoản {SHOP_NAME}. Mật khẩu tối thiểu 6 ký tự.
            </p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {apiError && (
                <p className="message message--error" role="alert">
                  {apiError}
                </p>
              )}
              {apiSuccess && (
                <p className="message" role="status">
                  {apiSuccess}
                </p>
              )}
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Họ"
                  type="text"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && (
                  <p className="message message--error">
                    Vui lòng nhập trường này
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Tên"
                  type="text"
                  {...register("firstName", { required: true })}
                />
                {errors.firstName && (
                  <p className="message message--error">
                    Vui lòng nhập trường này
                  </p>
                )}
              </div>

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
                  autoComplete="new-password"
                  {...register("password", { required: true, minLength: 6 })}
                />
                {errors.password?.type === "required" && (
                  <p className="message message--error">
                    Vui lòng nhập trường này
                  </p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="message message--error">
                    Mật khẩu tối thiểu 6 ký tự
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
                      {...register("terms", { required: true })}
                    />
                    <span className="checkbox__check" />
                    <p>Tôi đồng ý với điều khoản và chính sách bảo mật</p>
                  </label>
                </div>
                {errors.terms && (
                  <p className="message message--error">
                    Cần đồng ý điều khoản để tiếp tục
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>

              <p className="form__signup-link">
                <Link href="/login">Đã có tài khoản? Đăng nhập</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;
