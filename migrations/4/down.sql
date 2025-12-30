
-- Remove junction table
DROP INDEX idx_appointment_services_service_id;
DROP INDEX idx_appointment_services_appointment_id;
DROP TABLE appointment_services;
