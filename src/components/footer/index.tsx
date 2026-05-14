import Logo from "../../assets/icons/logo";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__description">
            <h6>
              <Logo /> <span>E</span>-Shop
            </h6>
            <p>
              E-Shop thiết kế thời trang cho mọi lứa tuổi — hướng tới phong cách
              hiện đại và trải nghiệm mua sắm tiện lợi.
            </p>
            <ul className="site-footer__social-networks">
              <li>
                <a href="#">
                  <i className="icon-facebook" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="icon-twitter" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="icon-linkedin" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="icon-instagram" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="icon-youtube-play" />
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__links">
            <ul>
              <li>Mua sắm trực tuyến</li>
              <li>
                <a href="#">Trạng thái đơn hàng</a>
              </li>
              <li>
                <a href="#">Giao hàng</a>
              </li>
              <li>
                <a href="#">Đổi trả</a>
              </li>
              <li>
                <a href="#">Phương thức thanh toán</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
            </ul>
            <ul>
              <li>Thông tin</li>
              <li>
                <a href="#">Thẻ quà tặng</a>
              </li>
              <li>
                <a href="#">Tìm cửa hàng</a>
              </li>
              <li>
                <a href="#">Bản tin</a>
              </li>
              <li>
                <a href="#">Trở thành thành viên</a>
              </li>
              <li>
                <a href="#">Góp ý website</a>
              </li>
            </ul>
            <ul>
              <li>Liên hệ</li>
              <li>
                <a href="#">hotro@eshop.vn</a>
              </li>
              <li>
                <a href="#">Hotline: 1900 0000</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container">
          <p>THIẾT KẾ UI — © 2026. BẢN QUYỀN THUỘC E-SHOP.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
