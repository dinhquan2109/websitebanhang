import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CheckoutItems from "@/components/checkout/items";
import CheckoutStatus from "@/components/checkout-status";
import type { RootState } from "@/store";
import { clearCart } from "@/store/reducers/cart";
import { formatVnd } from "@/utils/currency";

import Layout from "../../layouts/Main";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user, session } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("VN");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const priceTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  const handleSubmit = async () => {
    setError("");

    if (!session?.access_token) {
      void router.push("/login?redirect=/cart/checkout");
      return;
    }

    if (cartItems.length === 0) {
      setError("Giỏ hàng trống");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();
    if (!fullName || !phone || !address) {
      setError("Vui lòng điền họ tên, số điện thoại và địa chỉ");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          address,
          city,
          country,
          paymentMethod,
          shippingMethod,
          items: cartItems.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.count,
            color: item.color,
            size: item.size,
          })),
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        hint?: string;
        orderCode?: string;
      };

      if (!res.ok) {
        setError(data.error || data.hint || "Đặt hàng thất bại");
        return;
      }

      dispatch(clearCart());
      void router.push(
        `/orders?success=1&code=${encodeURIComponent(data.orderCode || "")}`,
      );
    } catch {
      setError("Lỗi kết nối. Thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Giao hàng & thanh toán</h3>
            <CheckoutStatus step="checkout" />
          </div>

          {!user && (
            <div className="checkout__btns" style={{ marginBottom: 24 }}>
              <Link href="/login?redirect=/cart/checkout" className="btn btn--rounded btn--yellow">
                Đăng nhập để đặt hàng
              </Link>
              <Link href="/register" className="btn btn--rounded btn--border">
                Đăng ký
              </Link>
            </div>
          )}

          {error && (
            <p style={{ color: "#c0392b", marginBottom: 16 }}>{error}</p>
          )}

          <div className="checkout-content">
            <div className="checkout__col-6">
              <div className="block">
                <h3 className="block__title">Thông tin giao hàng</h3>
                <form
                  className="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSubmit();
                  }}
                >
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Địa chỉ *"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Tên *"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Thành phố"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Họ *"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="tel"
                        placeholder="Số điện thoại *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row">
                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <option value="VN">Việt Nam</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="checkout__col-4">
              <div className="block">
                <h3 className="block__title">Phương thức thanh toán</h3>
                <ul className="round-options round-options--three">
                  <li className="round-item">
                    <label>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />{" "}
                      COD
                    </label>
                  </li>
                  <li className="round-item">
                    <label>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />{" "}
                      Thẻ
                    </label>
                  </li>
                </ul>
              </div>

              <div className="block">
                <h3 className="block__title">Hình thức giao hàng</h3>
                <ul className="round-options round-options--two">
                  <li className="round-item round-item--bg">
                    <label>
                      <input
                        type="radio"
                        name="ship"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                      />{" "}
                      Tiêu chuẩn — {formatVnd(300000)}
                    </label>
                  </li>
                  <li className="round-item round-item--bg">
                    <label>
                      <input
                        type="radio"
                        name="ship"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                      />{" "}
                      Nhanh — {formatVnd(500000)}
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            <div className="checkout__col-2">
              <div className="block">
                <h3 className="block__title">Giỏ hàng của bạn</h3>
                <CheckoutItems />

                <div className="checkout-total">
                  <p>Tổng cộng</p>
                  <h3>{formatVnd(priceTotal)}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-actions cart-actions--checkout">
            <Link href="/cart" className="cart__btn-back">
              <i className="icon-left" /> Quay lại
            </Link>
            <div className="cart-actions__items-wrapper">
              <Link href="/products" className="btn btn--rounded btn--border">
                Tiếp tục mua sắm
              </Link>
              <button
                type="button"
                className="btn btn--rounded btn--yellow"
                disabled={submitting || cartItems.length === 0}
                onClick={() => void handleSubmit()}
              >
                {submitting ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
