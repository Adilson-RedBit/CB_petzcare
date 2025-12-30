-- Limpa dados anteriores de demonstração (clientes de teste e agendamentos associados)
DELETE FROM appointment_services WHERE appointment_id IN (
  SELECT id FROM appointments WHERE owner_phone LIKE '1199000%'
);
DELETE FROM appointments WHERE owner_phone LIKE '1199000%';
DELETE FROM pets WHERE owner_phone LIKE '1199000%';

-- Insere 10 pets/clientes de demonstração
INSERT INTO pets (name, breed, size, weight_kg, age_years, special_notes, photo_url, coat_condition, coat_notes, owner_name, owner_phone, owner_email)
VALUES
('Bidu', 'SRD', 'pequeno', 8, 3, 'Calmo', null, 'bom', null, 'Cliente Demo 1', '11990000001', 'cliente1@demo.com'),
('Luna', 'Poodle', 'medio', 11, 5, null, null, 'excelente', null, 'Cliente Demo 2', '11990000002', 'cliente2@demo.com'),
('Thor', 'Labrador', 'grande', 32, 4, 'Adora água', null, 'regular', null, 'Cliente Demo 3', '11990000003', 'cliente3@demo.com'),
('Mia', 'Persa', 'pequeno', 4, 2, 'Gato dócil', null, 'bom', null, 'Cliente Demo 4', '11990000004', 'cliente4@demo.com'),
('Max', 'Golden', 'grande', 28, 6, null, null, 'excelente', null, 'Cliente Demo 5', '11990000005', 'cliente5@demo.com'),
('Nina', 'Beagle', 'medio', 12, 4, null, null, 'bom', null, 'Cliente Demo 6', '11990000006', 'cliente6@demo.com'),
('Bob', 'Bulldog', 'medio', 18, 5, 'Respira ruidoso', null, 'regular', null, 'Cliente Demo 7', '11990000007', 'cliente7@demo.com'),
('Mel', 'Shih-tzu', 'pequeno', 7, 3, null, null, 'excelente', null, 'Cliente Demo 8', '11990000008', 'cliente8@demo.com'),
('Simba', 'Maine Coon', 'medio', 9, 2, 'Gato grande e dócil', null, 'bom', null, 'Cliente Demo 9', '11990000009', 'cliente9@demo.com'),
('Pipoca', 'Vira-lata', 'pequeno', 10, 4, 'Muito agitado', null, 'regular', null, 'Cliente Demo 10', '11990000010', 'cliente10@demo.com');

-- Insere 10 agendamentos para o dia 2025-12-24 com serviços 1 (Banho) e 2 (Tosa)
-- Ajuste a data/horários se desejar
INSERT INTO appointments (pet_id, service_id, owner_name, owner_phone, owner_email, appointment_date, appointment_time, status, total_price, notes)
VALUES
((SELECT id FROM pets WHERE owner_phone='11990000001'), 1, 'Cliente Demo 1', '11990000001', 'cliente1@demo.com', '2025-12-24', '09:00', 'agendado', 120, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000002'), 1, 'Cliente Demo 2', '11990000002', 'cliente2@demo.com', '2025-12-24', '09:30', 'agendado', 120, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000003'), 1, 'Cliente Demo 3', '11990000003', 'cliente3@demo.com', '2025-12-24', '10:00', 'agendado', 130, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000004'), 1, 'Cliente Demo 4', '11990000004', 'cliente4@demo.com', '2025-12-24', '10:30', 'agendado', 110, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000005'), 1, 'Cliente Demo 5', '11990000005', 'cliente5@demo.com', '2025-12-24', '11:00', 'agendado', 140, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000006'), 1, 'Cliente Demo 6', '11990000006', 'cliente6@demo.com', '2025-12-24', '11:30', 'agendado', 125, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000007'), 1, 'Cliente Demo 7', '11990000007', 'cliente7@demo.com', '2025-12-24', '13:00', 'agendado', 125, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000008'), 1, 'Cliente Demo 8', '11990000008', 'cliente8@demo.com', '2025-12-24', '13:30', 'agendado', 115, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000009'), 1, 'Cliente Demo 9', '11990000009', 'cliente9@demo.com', '2025-12-24', '14:00', 'agendado', 135, 'Banho e tosa'),
((SELECT id FROM pets WHERE owner_phone='11990000010'), 1, 'Cliente Demo 10', '11990000010', 'cliente10@demo.com', '2025-12-24', '14:30', 'agendado', 120, 'Banho e tosa');

-- Para cada agendamento, adiciona relação de serviços (1 e 2) na tabela appointment_services
INSERT INTO appointment_services (appointment_id, service_id)
SELECT id, 1 FROM appointments WHERE owner_phone LIKE '1199000%';
INSERT INTO appointment_services (appointment_id, service_id)
SELECT id, 2 FROM appointments WHERE owner_phone LIKE '1199000%';


