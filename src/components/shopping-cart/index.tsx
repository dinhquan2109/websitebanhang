import Link from "next/link";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";

import CheckoutStatus from "../checkout-status";
import Item from "./item";

const ShoppingCart = () => {
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const priceTotal = () => {
    let totalPrice = 0;
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalPrice += item.price * item.count));
    }

    return totalPrice;
  };

  return (
    <section className="cart">
      <div className="container">
        <div className="cart__intro">
          <h3 className="cart__title">Giỏ hàng</h3>
          <CheckoutStatus step="cart" />
        </div>

        <div className="cart-list">
          {cartItems.length > 0 && (
            <table>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left" }}>Sản phẩm</th>
                  <th>Màu</th>
                  <th>Cỡ</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                  <th />
                </tr>

                {cartItems.map((item) => (
                  <Item
                    key={item.id}
                    id={item.id}
                    thumb={item.thumb}
                    name={item.name}
                    color={item.color}
                    price={item.price}
                    size={item.size}
                    count={item.count}
                  />
                ))}
              </tbody>
            </table>
          )}

          {cartItems.length === 0 && <p>Giỏ hàng đang trống</p>}
        </div>

        <div className="cart-actions">
          <Link href="/products" className="cart__btn-back">
            <i className="icon-left" /> Tiếp tục mua sắm
          </Link>
          <input
            type="text"
            placeholder="Mã giảm giá"
            className="cart__promo-code"
          />

          <div className="cart-actions__items-wrapper">
            <p className="cart-actions__total">
              Tổng cộng <strong>${priceTotal().toFixed(2)}</strong>
            </p>
            <Link
              href="/cart/checkout"
              className="btn btn--rounded btn--yellow"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
