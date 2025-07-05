DELETE FROM public.editions;

INSERT INTO public.editions (
  id, name, logo, year, "shortDescription", "longDescription", "catalogLink", "isVisible", "createdAt", "updatedAt"
)
VALUES
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000100',
  'ASTER+S > ART ^ SEALIFE',
  'https://i.imgur.com/Onq8x7S.png',
  2024,
  'In collaboration with the Institute of Marine Sciences (CSIC, Barcelona)

How can citizens contribute to better understanding and caring for our marine ecosystems affected by the Anthropocene?

Find it in this edition',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  'https://example.com/catalogs/summer2025.pdf',
  true,
  NOW(),
  NOW()),

  ('9a1b5c10-1c11-4a4f-a25e-aaa111000101',
  'ASTER+S > ART ^ NEUROSCIENCE',
  'https://i.imgur.com/WifKQ6t.png',
  2026,
  'In collaboration with the Institute of Marine Sciences (CSIC, Barcelona)

How can citizens contribute to better understanding and caring for our marine ecosystems affected by the Anthropocene?

Find it in this edition',
  'In this edition Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  null,
  true,
  NOW(),
  NOW()),
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000102', 'GreenTech 2024', 'https://example.com/logos/edition3.png', 2024, 'Sustainability-focused hackathon', 'Innovations for a greener planet', NULL, true, NOW(), NOW()),
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000103', 'Code from Home 2024', NULL, 2024, 'Remote-only coding event', 'Hack from anywhere in the world', NULL, false, NOW(), NOW()),
  ('9a1b5c10-1c11-4a4f-a25e-aaa111000104', 'AI + Robotics 2024', 'https://example.com/logos/edition5.png', 2024, 'Hybrid AI and robotics hackathon', 'Exploring cutting-edge tech', NULL, true, NOW(), NOW());
