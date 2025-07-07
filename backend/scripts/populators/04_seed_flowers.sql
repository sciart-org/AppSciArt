DELETE FROM public.flowers;

INSERT INTO public.flowers (
  "id",
  "title",
  "template",
  "conceptualMap",
  "state",
  "driveLink",
  "seedId",
  "createdAt",
  "updatedAt"
) VALUES (
  '22222222-2222-2222-2222-222222222221',
  'bionic',
  'Template A',
  'Concept Map A',
  'IN_PROGRESS',
  'https://drive.example.com/flower-1',
  '11111111-1111-1111-1111-111111111111',
  NOW(),
  NOW()
),
(
  '22222222-2222-2222-2222-222222222222',
  'bionic app',
  'Template C',
  'Concept Map C',
  'IN_BLANK',
  'https://drive.example.com/flower-3',
  '11111111-1111-1111-1111-111111111112',
  NOW(),
  NOW()
);
