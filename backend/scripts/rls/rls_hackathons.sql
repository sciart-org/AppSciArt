CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.hackathons
ALTER COLUMN id SET DEFAULT uuid_generate_v4();