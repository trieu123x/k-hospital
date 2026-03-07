/* ===============================
   SEED DATA FOR K-HOSPITAL
================================ */


/* ===============================
   SPECIALTIES
================================ */

INSERT INTO specialties (name, base_price, description)
VALUES
('Da liễu', 200000, 'Khám và điều trị các bệnh về da'),
('Hô hấp', 250000, 'Điều trị bệnh liên quan đến phổi và đường hô hấp'),
('Nội tổng quát', 180000, 'Khám và điều trị bệnh tổng quát');


/* ===============================
   DISEASE CATEGORIES
================================ */

INSERT INTO disease_categories (name, description)
VALUES
('Bệnh truyền nhiễm', 'Các bệnh lây qua virus và vi khuẩn'),
('Bệnh mãn tính', 'Các bệnh kéo dài lâu dài'),
('Bệnh da liễu', 'Các bệnh liên quan đến da');


/* ===============================
   USERS
================================ */

INSERT INTO profiles (id, full_name, phone, role)
VALUES
(uuid_generate_v4(), 'Nguyễn Văn A', '0900000001', 'patient'),
(uuid_generate_v4(), 'Trần Thị B', '0900000002', 'patient');


/* ===============================
   DOCTORS
================================ */

INSERT INTO profiles (id, full_name, phone, role)
VALUES
('11111111-1111-1111-1111-111111111111','Bác sĩ Lê Minh', '0900000003', 'doctor'),
('22222222-2222-2222-2222-222222222222','Bác sĩ Phạm Hùng', '0900000004', 'doctor');


INSERT INTO doctors (id, specialty_id, degree, experience, education)
VALUES
(
'11111111-1111-1111-1111-111111111111',
(SELECT id FROM specialties WHERE name='Da liễu'),
'Thạc sĩ',
'10 năm kinh nghiệm điều trị bệnh da',
'ĐH Y Dược TP.HCM'
),
(
'22222222-2222-2222-2222-222222222222',
(SELECT id FROM specialties WHERE name='Hô hấp'),
'Tiến sĩ',
'12 năm kinh nghiệm điều trị bệnh phổi',
'ĐH Y Hà Nội'
);


/* ===============================
   DISEASES
================================ */

INSERT INTO diseases
(category_id, specialty_id, name, description, symptoms, home_treatment)
VALUES
(
(SELECT id FROM disease_categories WHERE name='Bệnh truyền nhiễm'),
(SELECT id FROM specialties WHERE name='Hô hấp'),
'Cảm cúm',
'Bệnh do virus cúm gây ra',
'Sốt, ho, đau họng, mệt mỏi',
'Uống nhiều nước, nghỉ ngơi, dùng thuốc hạ sốt'
),
(
(SELECT id FROM disease_categories WHERE name='Bệnh da liễu'),
(SELECT id FROM specialties WHERE name='Da liễu'),
'Viêm da dị ứng',
'Phản ứng dị ứng trên da',
'Ngứa, nổi mẩn đỏ',
'Tránh dị nguyên và dùng thuốc bôi'
);


/* ===============================
   MEDICINES
================================ */

INSERT INTO medicines
(name, medicine_type, ingredients, dosage, usage_instruction)
VALUES
(
'Paracetamol',
'uống',
'Paracetamol 500mg',
'1 viên mỗi 6 giờ',
'Uống sau ăn'
),
(
'Loratadine',
'uống',
'Loratadine 10mg',
'1 viên mỗi ngày',
'Dùng khi bị dị ứng'
),
(
'Hydrocortisone Cream',
'bôi',
'Hydrocortisone',
'Bôi 2 lần/ngày',
'Bôi lên vùng da bị viêm'
);


/* ===============================
   DISEASE - MEDICINE
================================ */

INSERT INTO disease_medicine (disease_id, medicine_id)
VALUES
(
(SELECT id FROM diseases WHERE name='Cảm cúm'),
(SELECT id FROM medicines WHERE name='Paracetamol')
),
(
(SELECT id FROM diseases WHERE name='Viêm da dị ứng'),
(SELECT id FROM medicines WHERE name='Loratadine')
),
(
(SELECT id FROM diseases WHERE name='Viêm da dị ứng'),
(SELECT id FROM medicines WHERE name='Hydrocortisone Cream')
);


/* ===============================
   APPOINTMENTS
================================ */

INSERT INTO appointments
(patient_id, doctor_id, slot_time, status)
VALUES
(
(SELECT id FROM profiles WHERE role='patient' LIMIT 1),
'11111111-1111-1111-1111-111111111111',
NOW() + INTERVAL '1 day',
'pending'
);


/* ===============================
   NEWS
================================ */

INSERT INTO news (title, content)
VALUES
(
'Khai trương trung tâm khám bệnh K-Hospital',
'Bệnh viện K chính thức đưa vào hoạt động trung tâm khám bệnh số hóa.'
);


/* ===============================
   AI CHAT DEMO
================================ */

INSERT INTO chat_sessions (user_id)
VALUES
((SELECT id FROM profiles WHERE role='patient' LIMIT 1));


INSERT INTO chat_messages (session_id, content_summary)
VALUES
(
(SELECT id FROM chat_sessions LIMIT 1),
'Người dùng mô tả triệu chứng sốt và ho. AI gợi ý có thể là cảm cúm.'
);