import "dotenv/config"
import pkg from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
const { PrismaClient } = pkg

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const prisma = new PrismaClient({
    adapter
})

async function main() {
    console.log("🚀 Đang bắt đầu quá trình Seeding cho K-Hospital...");

    // 1. SPECIALTIES (CHUYÊN KHOA)
    const specDaLieu = await prisma.specialty.upsert({
        where: { name: 'Da liễu' },
        update: {},
        create: { name: 'Da liễu', basePrice: 200000, description: 'Khám và điều trị các bệnh về da' },
    });

    const specHoHap = await prisma.specialty.upsert({
        where: { name: 'Hô hấp' },
        update: {},
        create: { name: 'Hô hấp', basePrice: 250000, description: 'Điều trị bệnh liên quan đến phổi và đường hô hấp' },
    });

    const specNoi = await prisma.specialty.upsert({
        where: { name: 'Nội tổng quát' },
        update: {},
        create: { name: 'Nội tổng quát', basePrice: 180000, description: 'Khám và điều trị bệnh tổng quát' },
    });

    console.log("✅ Đã nạp Chuyên khoa");

    // 2. DISEASE CATEGORIES (NHÓM BỆNH)
    const catTruyenNhiem = await prisma.diseaseCategory.upsert({
        where: { name: 'Bệnh truyền nhiễm' },
        update: {},
        create: { name: 'Bệnh truyền nhiễm', description: 'Các bệnh lây qua virus và vi khuẩn' },
    });

    const catManTinh = await prisma.diseaseCategory.upsert({
        where: { name: 'Bệnh mãn tính' },
        update: {},
        create: { name: 'Bệnh mãn tính', description: 'Các bệnh kéo dài lâu dài' },
    });

    const catDaLieu = await prisma.diseaseCategory.upsert({
        where: { name: 'Bệnh da liễu' },
        update: {},
        create: { name: 'Bệnh da liễu', description: 'Các bệnh liên quan đến da' },
    });

    console.log("✅ Đã nạp Nhóm bệnh");

    // 3. PROFILES (NGƯỜI DÙNG & BÁC SĨ)
    // Bệnh nhân
    const patient1 = await prisma.profile.upsert({
        where: { phone: '0900000001' },
        update: {},
        create: { fullName: 'Nguyễn Văn A', phone: '0900000001', role: 'patient', email: 'vna@gmail.com' },
    });

    const patient2 = await prisma.profile.upsert({
        where: { phone: '0900000002' },
        update: {},
        create: { fullName: 'Trần Thị B', phone: '0900000002', role: 'patient', email: 'tranthib@gmail.com' },
    });

    // Bác sĩ
    const doctorProfile1 = await prisma.profile.upsert({
        where: { phone: '0900000003' },
        update: {},
        create: {
            id: '11111111-1111-1111-1111-111111111111',
            fullName: 'Bác sĩ Lê Minh',
            phone: '0900000003',
            role: 'doctor',
            email: 'leminh@hospital.vn'
        },
    });

    const doctorProfile2 = await prisma.profile.upsert({
        where: { phone: '0900000004' },
        update: {},
        create: {
            id: '22222222-2222-2222-2222-222222222222',
            fullName: 'Bác sĩ Phạm Hùng',
            phone: '0900000004',
            role: 'doctor',
            email: 'phamhung@hospital.vn'
        },
    });

    console.log("✅ Đã nạp Profiles");

    // 4. DOCTORS (THÔNG TIN BÁC SĨ CHI TIẾT)
    await prisma.doctor.upsert({
        where: { id: doctorProfile1.id },
        update: {},
        create: {
            id: doctorProfile1.id,
            specialtyId: specDaLieu.id,
            degree: 'Thạc sĩ',
            experience: '10 năm kinh nghiệm điều trị bệnh da',
            education: 'ĐH Y Dược TP.HCM',
        },
    });

    await prisma.doctor.upsert({
        where: { id: doctorProfile2.id },
        update: {},
        create: {
            id: doctorProfile2.id,
            specialtyId: specHoHap.id,
            degree: 'Tiến sĩ',
            experience: '12 năm kinh nghiệm điều trị bệnh phổi',
            education: 'ĐH Y Hà Nội',
        },
    });

    console.log("✅ Đã nạp Thông tin Bác sĩ");

    // 5. DISEASES (DANH MỤC BỆNH)
    // Xóa dữ liệu cũ để tránh lỗi trùng lặp khi seed lại vì Disease không có field unique trong schema hiện tại
    await prisma.disease.deleteMany({});

    const camCum = await prisma.disease.create({
        data: {
            categoryId: catTruyenNhiem.id,
            specialtyId: specHoHap.id,
            name: 'Cảm cúm',
            description: 'Bệnh do virus cúm gây ra',
            symptoms: 'Sốt, ho, đau họng, mệt mỏi',
            homeTreatment: 'Uống nhiều nước, nghỉ ngơi, dùng thuốc hạ sốt',
        },
    });

    const vienDa = await prisma.disease.create({
        data: {
            categoryId: catDaLieu.id,
            specialtyId: specDaLieu.id,
            name: 'Viêm da dị ứng',
            description: 'Phản ứng dị ứng trên da',
            symptoms: 'Ngứa, nổi mẩn đỏ',
            homeTreatment: 'Tránh dị nguyên và dùng thuốc bôi',
        },
    });

    console.log("✅ Đã nạp Danh mục bệnh");

    // 6. MEDICINES & liên kết DISEASE-MEDICINE
    await prisma.medicine.deleteMany({});
    const para = await prisma.medicine.create({
        data: { name: 'Paracetamol', medicineType: 'uống', ingredients: 'Paracetamol 500mg', dosage: '1 viên mỗi 6 giờ', usageInstruction: 'Uống sau ăn' }
    });
    const lora = await prisma.medicine.create({
        data: { name: 'Loratadine', medicineType: 'uống', ingredients: 'Loratadine 10mg', dosage: '1 viên mỗi ngày', usageInstruction: 'Dùng khi bị dị ứng' }
    });
    const hydro = await prisma.medicine.create({
        data: { name: 'Hydrocortisone Cream', medicineType: 'bôi', ingredients: 'Hydrocortisone', dosage: 'Bôi 2 lần/ngày', usageInstruction: 'Bôi lên vùng da bị viêm' }
    });

    await prisma.diseaseMedicine.createMany({
        data: [
            { diseaseId: camCum.id, medicineId: para.id },
            { diseaseId: vienDa.id, medicineId: lora.id },
            { diseaseId: vienDa.id, medicineId: hydro.id },
        ]
    });

    console.log("✅ Đã nạp Thuốc và liên kết");

    // 8. NEWS
    await prisma.news.deleteMany({});
    await prisma.news.create({
        data: {
            title: 'Khai trương trung tâm khám bệnh K-Hospital',
            content: 'Bệnh viện K chính thức đưa vào hoạt động trung tâm khám bệnh số hóa.',
        }
    });

    console.log("✅ Đã nạp Tin tức và Lịch hẹn");

    // 9. USER EVENTS 
    await prisma.userEvent.deleteMany({});

    const today = new Date();
    const morning = new Date(today.setHours(8, 30));
    const noon = new Date(today.setHours(12, 15));
    const afternoon = new Date(today.setHours(15, 45));
    const evening = new Date(today.setHours(20, 0));
    const midnight = new Date(today.setHours(23, 30));

    const testEvents = [
        {
            userId: patient1.id,
            eventType: 'VIEW_DOCTOR',
            entityId: doctorProfile1.id,
            metadata: { specialty: 'Da liễu', source: 'homepage' },
            createdAt: morning
        },
        {
            userId: patient1.id,
            eventType: 'CHAT_AI_TOPIC',
            metadata: { topic: 'Da liễu', question: 'Dấu hiệu viêm da dị ứng' },
            createdAt: morning
        },
        {
            userId: patient1.id,
            eventType: 'BOOK_APPOINTMENT',
            entityId: doctorProfile1.id,
            metadata: { shift: 1, price: 200000 },
            createdAt: noon
        },
        {
            userId: null, // Khách vãng lai
            eventType: 'VIEW_DISEASE',
            entityId: camCum.id,
            metadata: { device: 'Mobile', browser: 'Safari' },
            createdAt: afternoon
        },
        {
            userId: patient2.id,
            eventType: 'CHAT_AI_TOPIC',
            metadata: { topic: 'Hô hấp', question: 'Làm sao để hết ho khan?' },
            createdAt: afternoon
        },
        {
            userId: patient1.id,
            eventType: 'CANCEL_APPOINTMENT',
            entityId: null, // Giả sử hủy lịch vừa đặt
            metadata: { reason: 'Đổi lịch sang tuần sau' },
            createdAt: evening
        },
        {
            userId: patient2.id,
            eventType: 'CHAT_AI_TOPIC',
            metadata: { topic: 'Hô hấp', question: 'Cảm cúm uống thuốc gì?' },
            createdAt: evening
        },
        {
            userId: patient2.id,
            eventType: 'VIEW_DOCTOR',
            entityId: doctorProfile2.id,
            metadata: { specialty: 'Hô hấp', source: 'search' },
            createdAt: midnight
        },
        {
            userId: null,
            eventType: 'CHAT_AI_TOPIC',
            metadata: { topic: 'Nội tổng quát', question: 'Lịch khám tổng quát K-Hospital' },
            createdAt: midnight
        },
        {
            userId: patient1.id,
            eventType: 'CHAT_AI_TOPIC',
            metadata: { topic: 'Da liễu', question: 'Kem bôi Hydrocortisone dùng thế nào?' },
            createdAt: midnight
        }
    ];

    for (const ev of testEvents) {
        await prisma.userEvent.create({
            data: {
                userId: ev.userId,
                eventType: ev.eventType,
                entityId: ev.entityId,
                metadata: ev.metadata,
                createdAt: ev.createdAt
            }
        });
    }

    console.log("✅ Đã nạp 10 User Events khớp với dữ liệu hệ thống");
    console.log("🎉 SEEDING HOÀN TẤT!");
}

main()
    .catch((e) => {
        console.error("❌ Lỗi Seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });