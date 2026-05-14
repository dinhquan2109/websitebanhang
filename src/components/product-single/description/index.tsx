type ProductDescriptionType = {
  show: boolean;
};

const Description = ({ show }: ProductDescriptionType) => {
  const style = {
    display: show ? "flex" : "none",
  };

  return (
    <section style={style} className="product-single__description">
      <div className="product-description-block">
        <i className="icon-cart" />
        <h4>Chi tiết & mô tả sản phẩm</h4>
        <p>
          Áo thun Summer Vibes dòng uiKit với họa tiết nổi bật. <br />
          Chất liệu cotton jersey, dễ phối cùng quần jean, kaki hoặc short.
        </p>
      </div>
      <div className="product-description-block">
        <i className="icon-cart" />
        <h4>Chi tiết & mô tả sản phẩm</h4>
        <p>
          Áo thun Summer Vibes dòng uiKit với họa tiết nổi bật. <br />
          Chất liệu cotton jersey, dễ phối cùng quần jean, kaki hoặc short.
        </p>
      </div>
    </section>
  );
};

export default Description;
