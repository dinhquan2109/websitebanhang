import Head from "next/head";
import { useRouter } from "next/router";

import Header from "@/components/header";

type LayoutType = {
  title?: string;
  children?: React.ReactNode;
};

const ErrorPage = ({
  children,
  title = "E-Shop — Thương mại điện tử",
}: LayoutType) => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <div className="app-main">
      <Head>
        <title>Không tìm thấy trang &mdash; {title}</title>
      </Head>

      <Header isErrorPage />

      <main className={pathname !== "/" ? "main-page" : ""}>{children}</main>
    </div>
  );
};

export default ErrorPage;
