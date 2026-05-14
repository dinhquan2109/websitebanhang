import Link from "next/link";

import LayoutError from "../layouts/404";

const ErrorPage = () => (
  <LayoutError>
    <section className="error-page">
      <div className="container">
        <h1>Lỗi 404</h1>
        <p>Trang bạn tìm không tồn tại hoặc đã được di chuyển.</p>
        <Link href="/" className="btn btn--rounded btn--yellow">
          Về trang chủ
        </Link>
      </div>
    </section>
  </LayoutError>
);

export default ErrorPage;
