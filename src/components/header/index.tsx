import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOnClickOutside from "use-onclickoutside";

import { SHOP_NAME } from "@/constants/shop";
import type { RootState } from "@/store";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { clearUserSession } from "@/store/reducers/user";

import Logo from "../../assets/icons/logo";

type HeaderType = {
  isErrorPage?: boolean;
};

const Header = ({ isErrorPage }: HeaderType) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.user);
  const arrayPaths = ["/"];

  const [onTop, setOnTop] = useState(
    !(!arrayPaths.includes(router.pathname) || isErrorPage),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef(null);

  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(true);
    } else {
      setOnTop(false);
    }
  };

  useEffect(() => {
    if (!arrayPaths.includes(router.pathname) || isErrorPage) {
      return;
    }

    headerClass();
    window.onscroll = function () {
      headerClass();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ gắn scroll trên trang chủ
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    dispatch(clearUserSession());
    closeMenu();
    void router.push("/login");
  };

  // on click outside
  useOnClickOutside(navRef, closeMenu);
  useOnClickOutside(searchRef, closeSearch);

  return (
    <header className={`site-header ${!onTop ? "site-header--fixed" : ""}`}>
      <div className="container">
        <Link href="/">
          <h1 className="site-logo">
            <Logo />
            {SHOP_NAME}
          </h1>
        </Link>
        <nav
          ref={navRef}
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
        >
          <Link href="/products">Sản phẩm</Link>
          <a href="#">Cảm hứng</a>
          <a href="#">Không gian</a>
          {user ? (
            <button type="button" className="site-nav__btn" onClick={handleLogout}>
              <p>Xin chào, {user.name}</p>
            </button>
          ) : (
            <Link href="/login" className="site-nav__btn">
              Đăng nhập
            </Link>
          )}
        </nav>

        <div className="site-header__actions">
          <button
            ref={searchRef}
            className={`search-form-wrapper ${searchOpen ? "search-form--active" : ""}`}
          >
            <form className="search-form">
              <i
                className="icon-cancel"
                onClick={() => setSearchOpen(!searchOpen)}
              />
              <input
                type="text"
                name="search"
                placeholder="Nhập tên sản phẩm bạn cần tìm"
              />
            </form>
            <i
              onClick={() => setSearchOpen(!searchOpen)}
              className="icon-search"
            />
          </button>
          <Link href="/cart" legacyBehavior>
            <button className="btn-cart">
              <i className="icon-cart" />
              {cartItems.length > 0 && (
                <span className="btn-cart__count">{cartItems.length}</span>
              )}
            </button>
          </Link>
          <Link href={user ? "/products" : "/login"} legacyBehavior>
            <button
              className="site-header__btn-avatar"
              title={user ? user.name : "Đăng nhập"}
            >
              <i className="icon-avatar" />
            </button>
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="site-header__btn-menu"
          >
            <i className="btn-hamburger">
              <span />
            </i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
