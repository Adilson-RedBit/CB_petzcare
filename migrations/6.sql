
-- Add owner information to pets table
ALTER TABLE pets ADD COLUMN owner_name TEXT;
ALTER TABLE pets ADD COLUMN owner_phone TEXT;
ALTER TABLE pets ADD COLUMN owner_email TEXT;

-- Update existing pets with data from their appointments (if any)
UPDATE pets 
SET owner_name = (
  SELECT owner_name 
  FROM appointments 
  WHERE appointments.pet_id = pets.id 
  ORDER BY appointments.created_at DESC 
  LIMIT 1
),
owner_phone = (
  SELECT owner_phone 
  FROM appointments 
  WHERE appointments.pet_id = pets.id 
  ORDER BY appointments.created_at DESC 
  LIMIT 1
),
owner_email = (
  SELECT owner_email 
  FROM appointments 
  WHERE appointments.pet_id = pets.id 
  ORDER BY appointments.created_at DESC 
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM appointments WHERE appointments.pet_id = pets.id
);
