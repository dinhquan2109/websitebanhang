# Cấu hình Supabase cho Shop Dinhquan

Dự án dùng Supabase cho **đăng nhập**, **sản phẩm**, **đơn hàng** và **admin** (khớp báo cáo thực tập).

## 1. Biến môi trường (Vercel / `.env.local`)

| Biến | Bắt buộc | Ghi chú |
|------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Có | URL project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Có | Anon key |
| `NEXT_PUBLIC_SITE_URL` | Khuyến nghị | URL site (quên mật khẩu) |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed | Chỉ server — **không** public |
| `SEED_SECRET` | Tùy chọn | Bảo vệ `POST /api/seed` |

## 2. Tạo bảng

1. Mở [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**
2. Dán và chạy toàn bộ file `supabase/schema.sql`

## 3. Seed sản phẩm (6 SP mẫu)

**Cách A — API (cần service role trên Vercel):**

```bash
curl -X POST https://websitebanhang-seven.vercel.app/api/seed \
  -H "x-seed-secret: YOUR_SEED_SECRET"
```

**Cách B — SQL:** chạy `supabase/seed.sql` nếu không dùng service role.

## 4. Gán quyền admin

Sau khi đăng ký tài khoản, trong SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'email-cua-ban@gmail.com';
```

## 5. Kiểm tra

- `/products` — sản phẩm từ DB (fallback mock nếu DB trống)
- Đăng nhập → thêm giỏ → `/cart/checkout` → **Đặt hàng**
- `/orders` — lịch sử đơn
- `/admin` — quản trị (role admin)

## 6. Khớp báo cáo

| Nội dung báo cáo | Trong code |
|------------------|------------|
| ERD users, categories, products, orders, order_items | `supabase/schema.sql` |
| API sản phẩm | `GET /api/products`, `GET /api/product/[pid]` |
| API đơn hàng | `POST/GET /api/orders` |
| Checkout | `src/pages/cart/checkout.tsx` |
| Admin CRUD | `/admin/products`, `/admin/orders` |
