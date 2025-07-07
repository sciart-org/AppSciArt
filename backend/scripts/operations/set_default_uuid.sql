CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE PROCEDURE set_default_uuid_on_id_columns()
LANGUAGE plpgsql
AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.columns
        WHERE column_name = 'id'
            AND data_type = 'uuid'
            AND (table_schema = 'public'
                OR table_schema = 'profiles')
    LOOP
        EXECUTE format(
            'ALTER TABLE %I.%I ALTER COLUMN id SET DEFAULT uuid_generate_v4();',
            r.table_schema, r.table_name
        );
    END LOOP;
END;
$$;

CALL set_default_uuid_on_id_columns();
