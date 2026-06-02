import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { SHOP_NAME } from "@/constants/shop";
import { setUserSession } from "@/store/reducers/user";
import { mapSupabaseSession, mapSupabaseUser } from "@/utils/auth";

import Layout from "../layouts/Main";
import { postData } from "../utils/services";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
};

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type RegisterResponse = {
  status?: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
  user?: {
    id: string;
    email?: string;
    user_metadata?: { first_name?: string; last_name?: string };
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
  };
};

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

  const onSubmit = async (data: RegisterForm) => {
    setApiError(null);
    setApiSuccess(null);
    const result = await postData<RegisterResponse>("/api/register", {
      email: data.email.trim(),
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    if (result.status) {
      if (result.user && result.session) {
        dispatch(
          setUserSession({
            user: mapSupabaseUser(result.user),
            session: mapSupabaseSession(result.session),
          }),
        );
        await router.push("/products");
        return;
      }
      setApiSuccess(
        result.needsEmailConfirmation
          ? "Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư rồi đăng nhập."
          : `Đăng ký thành công tại ${SHOP_NAME}. Bạn có thể đăng nhập.`,
      );
      return;
    }
    setApiError(
      typeof result.error === "string"
        ? result.error
        : "Đăng ký thất bại. Vui lòng thử lại.",
    );
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
              Đăng ký qua Supabase Auth. Mật khẩu tối thiểu 6 ký tự theo cấu
              hình mặc định của Supabase.
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
                  type="text"
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
              >
                Đăng ký
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
