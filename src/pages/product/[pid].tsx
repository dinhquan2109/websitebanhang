import type { GetServerSideProps } from "next";
import { useState } from "react";

import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import Content from "@/components/product-single/content";
import Description from "@/components/product-single/description";
import Gallery from "@/components/product-single/gallery";
import Reviews from "@/components/product-single/reviews";
import ProductsFeatured from "@/components/products-featured";
// types
import type { ProductType } from "@/types";

import Layout from "../../layouts/Main";
import { getApiBaseFromRequest } from "../../utils/server";

type ProductPageType = {
  product: ProductType;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { pid } = query;
  const base = getApiBaseFromRequest(req);
  const res = await fetch(`${base}/api/product/${pid}`);
  const product = await res.json();

  return {
    props: {
      product,
    },
  };
};

const Product = ({ product }: ProductPageType) => {
  const [showBlock, setShowBlock] = useState("description");

  return (
    <Layout>
      <Breadcrumb />

      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            <Gallery images={product.images} />
            <Content product={product} />
          </div>

          <div className="product-single__info">
            <div className="product-single__info-btns">
              <button
                type="button"
                onClick={() => setShowBlock("description")}
                className={`btn btn--rounded ${showBlock === "description" ? "btn--active" : ""}`}
              >
                Mô tả
              </button>
              <button
                type="button"
                onClick={() => setShowBlock("reviews")}
                className={`btn btn--rounded ${showBlock === "reviews" ? "btn--active" : ""}`}
              >
                Đánh giá ({product.reviews.length})
              </button>
            </div>

            <Description show={showBlock === "description"} />
            <Reviews product={product} show={showBlock === "reviews"} />
          </div>
        </div>
      </section>

      <div className="product-single-page">
        <ProductsFeatured />
      </div>
      <Footer />
    </Layout>
  );
};

export default Product;
