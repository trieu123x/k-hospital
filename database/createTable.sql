/* =====================================================
   K-HOSPITAL DIGITAL CENTER DATABASE INIT SCRIPT
   Local PostgreSQL Setup
   ===================================================== */

/* ================================
   EXTENSIONS
================================ */

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


/* ================================
   DROP TABLES (RESET DATABASE)
================================ */

DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS disease_medicine CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS diseases CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS disease_categories CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS news CASCADE;


/* ================================
   MASTER DATA
================================ */

CREATE TABLE specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    base_price NUMERIC NOT NULL,
    description TEXT
);

CREATE TABLE disease_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT
);


/* ================================
   USERS
================================ */

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('admin','doctor','patient')),
    dob DATE,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);


/* ================================
   DOCTORS
================================ */

CREATE TABLE doctors (
    id UUID PRIMARY KEY,
    specialty_id UUID REFERENCES specialties(id),
    degree TEXT,
    experience TEXT,
    education TEXT,
    achievements TEXT,

    CONSTRAINT fk_doctor_profile
        FOREIGN KEY (id)
        REFERENCES profiles(id)
        ON DELETE CASCADE
);


/* ================================
   MEDICAL KNOWLEDGE
================================ */

CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES disease_categories(id),
    specialty_id UUID REFERENCES specialties(id),
    name TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    symptoms TEXT NOT NULL,
    home_treatment TEXT,
    embedding TEXT
);

CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image_url TEXT,
    medicine_type TEXT CHECK (medicine_type IN ('uống','ngậm','bôi','tiêm')),
    ingredients TEXT,
    dosage TEXT,
    usage_instruction TEXT,
    side_effects TEXT
);

CREATE TABLE disease_medicine (
    disease_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    PRIMARY KEY (disease_id, medicine_id)
);


/* ================================
   APPOINTMENTS
================================ */

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES profiles(id),
    doctor_id UUID REFERENCES profiles(id),
    slot_time TIMESTAMPTZ NOT NULL,

    status TEXT DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'confirmed',
            'denied',
            'completed',
            'cancelled'
        )),

    diagnosis_result TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);


/* ================================
   NOTIFICATIONS
================================ */

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    appointment_id UUID REFERENCES appointments(id),
    title TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);


/* ================================
   NEWS
================================ */

CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    new_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);


/* ================================
   AI CHAT SYSTEM
================================ */

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    started_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content_summary TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);


/* ================================
   INDEXES (PERFORMANCE)
================================ */

CREATE INDEX idx_disease_name
ON diseases(name);

CREATE INDEX idx_doctor_specialty
ON doctors(specialty_id);

CREATE INDEX idx_appointment_patient
ON appointments(patient_id);

CREATE INDEX idx_appointment_doctor
ON appointments(doctor_id);

CREATE INDEX idx_notification_user
ON notifications(user_id);


/* =====================================================
   END OF DATABASE SCRIPT
===================================================== */