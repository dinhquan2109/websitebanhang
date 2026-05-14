import SwiperCore, { EffectFade, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const PageIntro = () => {
  SwiperCore.use([EffectFade, Navigation]);

  return (
    <section className="page-intro">
      <Swiper navigation effect="fade" className="swiper-wrapper">
        <SwiperSlide>
          <div
            className="page-intro__slide"
            style={{ backgroundImage: "url('/images/slide-1.jpg')" }}
          >
            <div className="container">
              <div className="page-intro__slide__content">
                <h2>Khuyến mãi bộ sưu tập mùa hè</h2>
                <a href="#" className="btn-shop">
                  <i className="icon-right" />
                  Mua ngay
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="page-intro__slide"
            style={{ backgroundImage: "url('/images/slide-2.jpg')" }}
          >
            <div className="container">
              <div className="page-intro__slide__content">
                <h2>Biến nhà thành tổ ấm</h2>
                <a href="#" className="btn-shop">
                  <i className="icon-right" />
                  Mua ngay
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="shop-data">
        <div className="container">
          <ul className="shop-data__items">
            <li>
              <i className="icon-shipping" />
              <div className="data-item__content">
                <h4>Miễn phí vận chuyển</h4>
                <p>Với đơn từ $199</p>
              </div>
            </li>

            <li>
              <i className="icon-shipping" />
              <div className="data-item__content">
                <h4>99% khách hài lòng</h4>
                <p>Phản hồi tích cực từ cộng đồng</p>
              </div>
            </li>

            <li>
              <i className="icon-cash" />
              <div className="data-item__content">
                <h4>Đảm bảo chính hãng</h4>
                <p>Bảo hành 30 ngày cho từng sản phẩm</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PageIntro;
