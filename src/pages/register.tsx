import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../layouts/Main";
import { postData } from "../utils/services";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const { register, handleSubmit, errors } = useForm();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const onSubmit = async (data: RegisterForm) => {
    setApiError(null);
    setApiSuccess(null);
    const result = await postData<{
      status?: boolean;
      error?: string;
      needsEmailConfirmation?: boolean;
    }>("/api/register", {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    if (result.status) {
      setApiSuccess(
        result.needsEmailConfirmation
          ? "Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư rồi đăng nhập."
          : "Đăng ký thành công. Bạn có thể đăng nhập.",
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
                  name="lastName"
                  ref={register({ required: true })}
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
                  name="firstName"
                  ref={register({ required: true })}
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
                  name="email"
                  ref={register({
                    required: true,
                    pattern:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                />
                {errors.email && errors.email.type === "required" && (
                  <p className="message message--error">
                    Vui lòng nhập trường này
                  </p>
                )}
                {errors.email && errors.email.type === "pattern" && (
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
                  name="password"
                  ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type === "required" && (
                  <p className="message message--error">
                    Vui lòng nhập trường này
                  </p>
                )}
                {errors.password && errors.password.type === "minLength" && (
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
                      name="terms"
                      type="checkbox"
                      id="check-signed-in"
                      ref={register({ required: true })}
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
