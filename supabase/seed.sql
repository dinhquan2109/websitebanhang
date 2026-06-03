-- Chạy sau schema.sql nếu không dùng POST /api/seed
-- (Cần có category ao-thun trước — seed API tạo tự động)

insert into public.categories (name, slug, description, image_url)
values ('Áo thun', 'ao-thun', 'Áo thun nam nữ', '/images/products/product-1.jpg')
on conflict (slug) do nothing;

-- Gán admin (sửa email)
-- update public.profiles set role = 'admin' where email = 'you@example.com';
