import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../layouts/Main";
import { postData } from "../utils/services";

type LoginMail = {
  email: string;
  password: string;
  keepSigned?: boolean;
};

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const LoginPage = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginMail>();

  const onSubmit = async (data: LoginMail) => {
    setApiError(null);
    const result = await postData<{ status?: boolean; error?: string }>(
      "/api/login",
      {
        email: data.email,
        password: data.password,
      },
    );
    if (result.status) {
      await router.push("/products");
      return;
    }
    setApiError(
      typeof result.error === "string"
        ? result.error
        : "Đăng nhập thất bại. Kiểm tra email và mật khẩu.",
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
            <h2 className="form-block__title">Đăng nhập</h2>
            <p className="form-block__description">
              Đăng nhập bằng tài khoản Supabase Auth của bạn. Tạo tài khoản
              trong Supabase (Authentication) hoặc qua trang đăng ký.
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

              <div className="form__btns">
                <button type="button" className="btn-social fb-btn">
                  <i className="icon-facebook" />
                  Facebook
                </button>
                <button type="button" className="btn-social google-btn">
                  <img src="/images/icons/gmail.svg" alt="Gmail" /> Gmail
                </button>
              </div>

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
              >
                Đăng nhập
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
