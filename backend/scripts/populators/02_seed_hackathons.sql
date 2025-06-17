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
    'https://example.com/logos/hack1.png',
    '2025-07-01',
    '2025-07-03',
    'ONLINE',
    NULL,
    'A fully online summer hackathon.',
    true,
    'https://meet.example.com/hack1',
    100,
    NOW(),
    NOW()
  ),
  (
    'https://example.com/logos/hack2.png',
    '2025-08-15',
    '2025-08-17',
    'ON_SITE',
    'New York, NY',
    'An on-site hackathon focused on fintech innovation.',
    true,
    NULL,
    101,
    NOW(),
    NOW()
  ),
  (
    'https://example.com/logos/hack3.png',
    '2025-09-10',
    '2025-09-12',
    'HYBRID',
    'San Francisco, CA',
    'A hybrid hackathon exploring sustainability solutions.',
    false,
    'https://meet.example.com/hack3',
    102,
    NOW(),
    NOW()
  ),
  (
    'https://example.com/logos/hack4.png',
    '2024-10-05',
    '2024-10-07',
    'ON_SITE',
    'Berlin, Germany',
    'Hack4Climate: Past hackathon focused on green tech.',
    true,
    NULL,
    103,
    NOW(),
    NOW()
  ),
  (
    'https://example.com/logos/hack5.png',
    '2024-05-10',
    '2024-05-12',
    'ONLINE',
    NULL,
    'Code from Home 2024: A past remote-only event.',
    false,
    'https://meet.example.com/hack5',
    103,
    NOW(),
    NOW()
  ),
  (
    'https://example.com/logos/hack6.png',
    '2024-11-20',
    '2024-11-22',
    'HYBRID',
    'Tokyo, Japan',
    'FusionHack 2024: Hybrid hackathon around AI + Robotics.',
    true,
    'https://meet.example.com/hack6',
    104,
    NOW(),
    NOW()
  );
