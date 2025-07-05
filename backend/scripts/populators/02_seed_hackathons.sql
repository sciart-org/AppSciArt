DELETE FROM public.hackathons;

INSERT INTO public.hackathons (
  logo,
  "startDate",
  "endDate",
  type,
  location,
  description,
  "isVisible",
  "meetLink",
  "editionId",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    'https://i.imgur.com/QCm4N6t.png',
    '2026-01-29',
    '2026-01-31',
    'ON_SITE',
    'Escuela Técnica Superior de Ingeniería Informática de la Universidad de Sevilla
(Av. Reina Mercedes s/n, 41012 Sevilla, Spain)',
    'Explore the boundaries of art and science around the brain and cognition,
developing new ways to understand the human mind',
    true,
    'https://meet.example.com/hack1',
    '9a1b5c10-1c11-4a4f-a25e-aaa111000101',
    NOW(),
    NOW()
  ),
  (
    'https://i.imgur.com/QCm4N6t.png',
    '2025-08-15',
    '2025-08-17',
    'ON_SITE',
    'New York, NY',
    'An on-site hackathon focused on fintech innovation.',
    true,
    NULL,
    '9a1b5c10-1c11-4a4f-a25e-aaa111000102',
    NOW(),
    NOW()
  ),
  (
    'https://i.imgur.com/QCm4N6t.png',
    '2025-09-10',
    '2025-09-12',
    'HYBRID',
    'San Francisco, CA',
    'A hybrid hackathon exploring sustainability solutions.',
    false,
    'https://meet.example.com/hack3',
    '9a1b5c10-1c11-4a4f-a25e-aaa111000102',
    NOW(),
    NOW()
  ),
  (
    'https://i.imgur.com/QCm4N6t.png',
    '2024-10-05',
    '2024-10-07',
    'ON_SITE',
    'Berlin, Germany',
    'Hack4Climate: Past hackathon focused on green tech.',
    true,
    NULL,
    '9a1b5c10-1c11-4a4f-a25e-aaa111000103',
    NOW(),
    NOW()
  ),
  (
    'https://i.imgur.com/QCm4N6t.png',
    '2024-05-10',
    '2024-05-12',
    'ONLINE',
    NULL,
    'Code from Home 2024: A past remote-only event.',
    false,
    'https://meet.example.com/hack5',
    '9a1b5c10-1c11-4a4f-a25e-aaa111000103',
    NOW(),
    NOW()
  ),
  (
    'https://i.imgur.com/QCm4N6t.png',
    '2024-11-20',
    '2024-11-22',
    'HYBRID',
    'Tokyo, Japan',
    'FusionHack 2024: Hybrid hackathon around AI + Robotics.',
    true,
    'https://meet.example.com/hack6',
    '9a1b5c10-1c11-4a4f-a25e-aaa111000104',
    NOW(),
    NOW()
  );
