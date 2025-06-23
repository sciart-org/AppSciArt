DELETE FROM public.editions;

INSERT INTO public.editions (
  id, name, logo, year, "shortDescription", "longDescription", "catalogLink", "isVisible", "createdAt", "updatedAt"
)
VALUES
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000100', 'Summer Sprint 2025', 'https://example.com/logos/edition1.png', 2025, 'Intense summer hackathon', 'The biggest summer edition yet', 'https://example.com/catalogs/summer2025.pdf', true, NOW(), NOW()),
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000101', 'FinTech 2025', 'https://example.com/logos/edition2.png', 2025, 'Focused on fintech innovation', 'Deep dive into fintech solutions', NULL, true, NOW(), NOW()),
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000102', 'GreenTech 2024', 'https://example.com/logos/edition3.png', 2024, 'Sustainability-focused hackathon', 'Innovations for a greener planet', NULL, true, NOW(), NOW()),
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000103', 'Code from Home 2024', NULL, 2024, 'Remote-only coding event', 'Hack from anywhere in the world', NULL, false, NOW(), NOW()),
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000104', 'AI + Robotics 2024', 'https://example.com/logos/edition5.png', 2024, 'Hybrid AI and robotics hackathon', 'Exploring cutting-edge tech', NULL, true, NOW(), NOW());
