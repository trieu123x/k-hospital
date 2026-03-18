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
        create: { fullName: 'Nguyễn Văn A', phone: '0900000001', role: 'patient' },
    });

    const patient2 = await prisma.profile.upsert({
        where: { phone: '0900000002' },
        update: {},
        create: { fullName: 'Trần Thị B', phone: '0900000002', role: 'patient' },
    });

    // Bác sĩ
    const doctorProfile1 = await prisma.profile.upsert({
        where: { phone: '0900000003' },
        update: {},
        create: { 
            id: '11111111-1111-1111-1111-111111111111', 
            fullName: 'Bác sĩ Lê Minh', 
            phone: '0900000003', 
            role: 'doctor' 
        },
    });

    const doctorProfile2 = await prisma.profile.upsert({
        where: { phone: '0900000004' },
        update: {},
        create: { 
            id: '22222222-2222-2222-2222-222222222222', 
            fullName: 'Bác sĩ Phạm Hùng', 
            phone: '0900000004', 
            role: 'doctor' 
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

    // 7. APPOINTMENTS (LỊCH HẸN)
    await prisma.appointment.deleteMany({});
    await prisma.appointment.create({
        data: {
            patientId: patient1.id,
            doctorId: doctorProfile1.id,
            slotTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 ngày
            status: 'pending',
        }
    });

    // 8. NEWS
    await prisma.news.deleteMany({});
    await prisma.news.create({
        data: {
            title: 'Khai trương trung tâm khám bệnh K-Hospital',
            content: 'Bệnh viện K chính thức đưa vào hoạt động trung tâm khám bệnh số hóa.',
        }
    });

    console.log("✅ Đã nạp Tin tức và Lịch hẹn");
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