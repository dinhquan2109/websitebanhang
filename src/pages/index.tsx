import Footer from "@/components/footer";
import PageIntro from "@/components/page-intro";
import ProductsFeatured from "@/components/products-featured";
import Subscribe from "@/components/subscribe";

import Layout from "../layouts/Main";

const IndexPage = () => {
  return (
    <Layout>
      <PageIntro />

      <section className="featured">
        <div className="container">
          <article
            style={{ backgroundImage: "url(/images/featured-1.jpg)" }}
            className="featured-item featured-item-large"
          >
            <div className="featured-item__content">
              <h3>Hàng mới đã có mặt!</h3>
              <a href="#" className="btn btn--rounded">
                Xem bộ sưu tập
              </a>
            </div>
          </article>

          <article
            style={{ backgroundImage: "url(/images/featured-2.jpg)" }}
            className="featured-item featured-item-small-first"
          >
            <div className="featured-item__content">
              <h3>Áo thun cơ bản 750.000₫</h3>
              <a href="#" className="btn btn--rounded">
                Chi tiết
              </a>
            </div>
          </article>

          <article
            style={{ backgroundImage: "url(/images/featured-3.jpg)" }}
            className="featured-item featured-item-small"
          >
            <div className="featured-item__content">
              <h3>Khuyến mãi mùa hè</h3>
              <a href="#" className="btn btn--rounded">
                Xem tất cả
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <header className="section__intro">
            <h4>Vì sao nên chọn chúng tôi?</h4>
          </header>

          <ul className="shop-data-items">
            <li>
              <i className="icon-shipping" />
              <div className="data-item__content">
                <h4>Miễn phí vận chuyển</h4>
                <p>
                  Đơn từ 5.000.000₫ trở lên được miễn phí giao hàng qua bưu điện
                  nội địa.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-payment" />
              <div className="data-item__content">
                <h4>Thanh toán dễ dàng</h4>
                <p>
                  Mọi giao dịch đều được xử lý nhanh qua kênh thanh toán an
                  toàn.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-cash" />
              <div className="data-item__content">
                <h4>Hoàn tiền</h4>
                <p>
                  Nếu sản phẩm bị lỗi hoặc bạn đổi ý, có thể gửi trả và nhận
                  hoàn tiền theo chính sách.
                </p>
              </div>
            </li>

            <li>
              <i className="icon-materials" />
              <div className="data-item__content">
                <h4>Chất lượng cao</h4>
                <p>Mỗi sản phẩm được chọn lọc chất liệu và hoàn thiện tỉ mỉ.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <ProductsFeatured />
      <Subscribe />
      <Footer />
    </Layout>
  );
};

export default IndexPage;
