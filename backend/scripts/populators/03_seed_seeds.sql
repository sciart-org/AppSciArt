DELETE FROM public.seeds;

INSERT INTO public.seeds (
  "id",
  "title",
  "template",
  "mainImage",
  "state",
  "branchesOfKnowledge",
  "seedPDF",
  "videoLink",
  "presentationLink",
  "podcastLink",
  "driveLink",
  "createdAt",
  "updatedAt"
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Neuroharmony',
  null,
  'https://i.imgur.com/Vquxl8C.png',
  'PUBLISHED',
  ARRAY['Psychobiology', 'Neuroscience'],
  'https://aster.us.es/alleditions/wp-content/uploads/2025/01/ASTERS_2025_NS_SEMILLA_13_IsabelMartin_NeuroArmonia.pdf',
  null,
  null,
  null,
  null,
  NOW(),
  NOW()
),
(
  '11111111-1111-1111-1111-111111111112',
  'Beyond the last frontier',
  null,
  'https://i.imgur.com/FepusLs.png',
  'PUBLISHED',
  ARRAY['Neurotechnology', 'Neuroscience'],
  'https://aster.us.es/alleditions/wp-content/uploads/2025/01/ASTERS_2025_NS_SEMILLA_14_EmilioDuran_UltimaFrontera.pdf',
  null,
  null,
  null,
  null,
  NOW(),
  NOW()
);

DELETE FROM public.seed_editions;

INSERT INTO public.seed_editions (
  "seedId",
  "editionId",
  "createdAt",
  "updatedAt"
)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '9a1b5c10-1c11-4a4f-a25e-aaa111000101',
  NOW(),
  NOW()
),
(
  '11111111-1111-1111-1111-111111111112',
  '9a1b5c10-1c11-4a4f-a25e-aaa111000101',
  NOW(),
  NOW()
);
