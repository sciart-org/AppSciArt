DELETE FROM public.fruits;

INSERT INTO public.fruits (
  "id",
  "title",
  "state",
  "authorVision",
  "curatorVision",
  "driveLink",
  "flowerId",
  "createdAt",
  "updatedAt"
) VALUES
(
  '33333333-3333-3333-3333-333333333331',
  'BI/ONIC I',
  'IN_BLANK',
  'Author 1A',
  'Curator 1A',
  'https://drive.example.com/fruit-1a',
  '22222222-2222-2222-2222-222222222221',
  NOW(),
  NOW()),
(
  '33333333-3333-3333-3333-333333333332',
  'BI/ONIC II',
  'IN_REVIEW',
  'Author 2A',
  'Curator 2A',
  'https://drive.example.com/fruit-2a',
  '22222222-2222-2222-2222-222222222222',
  NOW(),
  NOW()
);