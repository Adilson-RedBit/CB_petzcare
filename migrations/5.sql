
-- Add pricing based on pet size for services
CREATE TABLE service_pricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL,
  size TEXT NOT NULL, -- pequeno, medio, grande
  base_price REAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add photo and coat condition fields to pets table
ALTER TABLE pets ADD COLUMN photo_url TEXT;
ALTER TABLE pets ADD COLUMN coat_condition TEXT; -- excelente, bom, regular, ruim
ALTER TABLE pets ADD COLUMN coat_notes TEXT; -- specific notes about coat condition

-- Remove the fixed price from services table since it will be dynamic
-- We'll keep it for now for backward compatibility but use service_pricing for new logic
