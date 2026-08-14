-- =========================================================================
-- XONOBOD — Demo/seed data.
-- Run AFTER schema.sql. Safe to skip entirely — the app works empty, and
-- everything here is meant to be edited or deleted from /admin.
--
-- IMPORTANT: names, phone numbers, and addresses below are PLACEHOLDER
-- demo content, not verified real businesses. Historical claims in
-- about_content are intentionally left blank in schema.sql for the same
-- reason — replace with sourced facts before going live.
-- =========================================================================

insert into recreation_places (name, short_description, description_html, cover_image, address, coordinates, phone, working_hours, price_info, amenities, category_tag, featured, published, seo)
values
('Chinor bog''i dam olish maskani', 'Katta chinor daraxtlari soyasida oilaviy dam olish maskani.', '<p>Xonobod atrofidagi eng mashhur dam olish maskanlaridan biri — namuna matn, tahrirlang.</p>', 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?q=80&w=1200&auto=format&fit=crop', 'Xonobod tumani, Bog'' ko''chasi (namuna manzil)', '{"lat": 40.7386, "lng": 72.3184}', '+998 90 123 45 67', '08:00 – 22:00', '50 000 so''mdan (namuna narx)', array['Wi-Fi','Avtoturargoh','Mangal joyi'], null, true, true, '{"slug": "chinor-bogi-dam-olish-maskani"}'),
('Bulbuloq soyliq maskani', 'Tog'' bulog''i bo''yida joylashgan tabiiy dam olish hududi.', '<p>Namuna tavsif — tahrirlang.</p>', 'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop', 'Xonobod tumani (namuna manzil)', '{"lat": 40.751, "lng": 72.335}', '+998 90 234 56 78', '09:00 – 21:00', null, array['Oshxona','Bolalar maydonchasi'], null, false, true, '{"slug": "bulbuloq-soyliq-maskani"}');

insert into sanatoriums (name, short_description, description_html, cover_image, address, coordinates, phone, amenities, extra, featured, published, seo)
values
('Sog''lom Hayot sanatoriyasi', 'Mineral suvlar bilan davolash yo''nalishidagi sanatoriya.', '<p>Namuna tavsif — tahrirlang.</p>', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop', 'Xonobod tumani (namuna manzil)', '{"lat": 40.742, "lng": 72.31}', '+998 90 345 67 89', array['Wi-Fi','Basseyn','Restoran'], '{"treatment_directions": "Mineral suvlar, balchiq terapiyasi (namuna)"}', true, true, '{"slug": "soglom-hayot-sanatoriyasi"}');

insert into dachas (name, short_description, description_html, cover_image, address, coordinates, phone, amenities, extra, published, seo)
values
('Bog''bon dachasi', 'Katta hovlili, basseynli oilaviy dacha.', '<p>Namuna tavsif — tahrirlang.</p>', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop', 'Xonobod tumani (namuna manzil)', '{"lat": 40.735, "lng": 72.328}', '+998 90 456 78 90', array['Basseyn','Barbekyu','Wi-Fi','Avtoturargoh'], '{"guest_count": 12, "room_count": 4, "bed_count": 8}', true, '{"slug": "bogbon-dachasi"}');

insert into restaurants (name, short_description, description_html, cover_image, address, coordinates, phone, working_hours, category_tag, amenities, extra, published, seo)
values
('Osiyo taomlari restorani', 'Milliy taomlar tortiladigan oilaviy restoran.', '<p>Namuna tavsif — tahrirlang.</p>', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop', 'Xonobod markazi (namuna manzil)', '{"lat": 40.7395, "lng": 72.32}', '+998 90 567 89 01', '09:00 – 23:00', 'Milliy taomlar', array['Wi-Fi','Ochiq terassa'], '{"cuisine_type": "O''zbek milliy taomlari", "average_check": "80 000 so''m (namuna)"}', true, '{"slug": "osiyo-taomlari-restorani"}');

insert into accommodations (name, short_description, description_html, cover_image, address, coordinates, phone, category_tag, amenities, extra, published, seo)
values
('Xonobod mehmonxonasi', 'Zamonaviy qulayliklarga ega mehmonxona.', '<p>Namuna tavsif — tahrirlang.</p>', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop', 'Xonobod markazi (namuna manzil)', '{"lat": 40.74, "lng": 72.322}', '+998 90 678 90 12', 'Mehmonxona', array['Wi-Fi','Nonushta','Konditsioner'], '{"room_count": 24}', true, '{"slug": "xonobod-mehmonxonasi"}');

insert into attractions (name, short_description, description_html, cover_image, address, coordinates, category_tag, extra, featured, published, seo)
values
('Tarixiy work masjidi', 'Mintaqadagi tarixiy me''moriy yodgorlik (namuna nom — tekshirilgan tarixiy ma''lumot bilan almashtiring).', '<p>Namuna tavsif — nashr qilishdan oldin tasdiqlangan tarixiy ma''lumot bilan almashtiring.</p>', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200&auto=format&fit=crop', 'Xonobod tumani (namuna manzil)', '{"lat": 40.7412, "lng": 72.315}', 'Tarixiy obidalar', '{"visit_tips": "Ertalab tashrif buyurish tavsiya etiladi (namuna)"}', true, true, '{"slug": "tarixiy-work-masjidi"}');

insert into events (title, description_html, start_date, start_time, location_text, published, seo)
values
('Bahor bayrami sayli', '<p>Namuna tadbir tavsifi — tahrirlang.</p>', current_date + interval '14 days', '10:00', 'Xonobod markaziy bog''i (namuna manzil)', true, '{"slug": "bahor-bayrami-sayli"}');
