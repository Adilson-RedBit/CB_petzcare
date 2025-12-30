
CREATE TABLE working_hours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  appointment_duration INTEGER DEFAULT 30, -- in minutes
  break_start TEXT,
  break_end TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE business_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  business_name TEXT NOT NULL DEFAULT 'PetCare Agenda',
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  instagram TEXT,
  description TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#8B5CF6',
  business_hours_display TEXT DEFAULT 'Seg-Sáb: 8h às 18h',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default business configuration
INSERT INTO business_config (
  business_name, phone, whatsapp, email, address, instagram, description
) VALUES (
  'PetCare Agenda',
  '(11) 9999-9999',
  '11999999999',
  'contato@petcare.com',
  'Rua dos Pets, 123 - São Paulo/SP',
  '@petcare.agenda',
  'Cuidamos do seu pet com carinho e profissionalismo. Banho, tosa e muito amor!'
);

-- Insert default working hours (Monday to Saturday)
INSERT INTO working_hours (day_of_week, start_time, end_time, is_active, appointment_duration, break_start, break_end) VALUES
(1, '08:00', '18:00', 1, 30, '12:00', '13:00'), -- Monday
(2, '08:00', '18:00', 1, 30, '12:00', '13:00'), -- Tuesday
(3, '08:00', '18:00', 1, 30, '12:00', '13:00'), -- Wednesday
(4, '08:00', '18:00', 1, 30, '12:00', '13:00'), -- Thursday
(5, '08:00', '18:00', 1, 30, '12:00', '13:00'), -- Friday
(6, '08:00', '16:00', 1, 30, '12:00', '13:00'); -- Saturday
