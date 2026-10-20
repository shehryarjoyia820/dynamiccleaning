-- Blog: featured image + alt text, and rich HTML bodies from the visual/HTML editor.

alter table public.posts add column if not exists cover_url text;
alter table public.posts add column if not exists cover_alt text;
alter table public.posts add column if not exists body_html text;

-- Public bucket for blog images (featured images and images inside posts).
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;
