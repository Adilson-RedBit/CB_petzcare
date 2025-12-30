
-- Remove owner information from pets table
ALTER TABLE pets DROP COLUMN owner_email;
ALTER TABLE pets DROP COLUMN owner_phone;
ALTER TABLE pets DROP COLUMN owner_name;
