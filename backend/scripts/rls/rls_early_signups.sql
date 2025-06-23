CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE public.early_signups ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.early_signups
ALTER COLUMN id SET DEFAULT uuid_generate_v4();
