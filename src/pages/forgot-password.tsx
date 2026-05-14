import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../layouts/Main";
import { postData } from "../utils/services";

type ForgotMail = {
  email: string;
};

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotMail>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const onSubmit = async (data: ForgotMail) => {
    setApiError(null);
    setApiMessage(null);
    const result = await postData<{
      status?: boolean;
      error?: string;
      message?: string;
    }>("/api/forgot-password", {
      email: data.email,
    });
    if (result.status) {
      setApiMessage(
        result.message ??
          "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
      );
      return;
    }
    setApiError(
      typeof result.error === "string"
        ? result.error
        : "Không gửi được yêu cầu. Thử lại sau.",
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
            <h2 className="form-block__title">Quên mật khẩu?</h2>
            <p className="form-block__description">
              Nhập email đã đăng ký. Supabase sẽ gửi liên kết đặt lại mật khẩu
              (cần cấu hình SMTP / mail trong Supabase).
            </p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {apiError && (
                <p className="message message--error" role="alert">
                  {apiError}
                </p>
              )}
              {apiMessage && (
                <p className="message" role="status">
                  {apiMessage}
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

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
              >
                Gửi liên kết đặt lại mật khẩu
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
