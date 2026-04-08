import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "crypto";

const { PrismaClient } = pkg;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==========================================
// HÀM TIỆN ÍCH RANDOM
// ==========================================
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateUUID = () => crypto.randomUUID();

const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương"];
const tenDem = ["Văn", "Thị", "Minh", "Ngọc", "Hải", "Tuấn", "Phương", "Thảo", "Linh", "Quang", "Hữu", "Thanh", "Bảo", "Đức"];
const ten = ["Anh", "Nam", "Trang", "Dũng", "Đạt", "Hà", "Hương", "Khang", "Khoa", "Phát", "Tâm", "Vy", "Yến", "Sơn", "Long"];
const randomName = () => `${getRandom(ho)} ${getRandom(tenDem)} ${getRandom(ten)}`;

async function main() {
    console.log("🚀 BẮT ĐẦU SEEDING DỮ LIỆU TẬP TRUNG (8 NGÀY GẦN ĐÂY)...");

    // 0. DỌN DẸP
    console.log("🧹 Đang dọn dẹp Database...");
    await prisma.userEvent.deleteMany({});
    await prisma.medicalRecord.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.diseaseMedicine.deleteMany({});
    await prisma.medicine.deleteMany({});
    await prisma.disease.deleteMany({});
    await prisma.doctorLeave.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.diseaseCategory.deleteMany({});
    await prisma.specialty.deleteMany({});
    await prisma.news.deleteMany({});

    // 1. CHUYÊN KHOA (15)
    const specialtyNames = ["Da liễu", "Hô hấp", "Nội tổng quát", "Tim mạch", "Tiêu hóa", "Thần kinh", "Cơ xương khớp", "Nhi khoa", "Phụ sản", "Tai mũi họng", "Răng hàm mặt", "Mắt", "Ung bướu", "Nội tiết", "Nam khoa"];
    const specialties = [];
    for (const name of specialtyNames) {
        const spec = await prisma.specialty.create({
            data: { name, basePrice: getRandom([150000, 200000, 250000, 500000]), description: `Khoa ${name}` }
        });
        specialties.push(spec);
    }

    // 2. NHÓM BỆNH (10)
    const categoryNames = ["Truyền nhiễm", "Mãn tính", "Da liễu", "Tim mạch", "Tiêu hóa", "Thần kinh", "Xương khớp", "Hô hấp", "Nội tiết", "Nhi"];
    const categories = [];
    for (const name of categoryNames) {
        const cat = await prisma.diseaseCategory.create({ data: { name, description: `Nhóm ${name}` } });
        categories.push(cat);
    }

    // 3. BỆNH NHÂN (30)
    const patients = [];
    for (let i = 1; i <= 30; i++) {
        const p = await prisma.profile.create({
            data: {
                id: generateUUID(), fullName: randomName(), phone: `090${getRandomInt(1000000, 9999999)}`,
                role: 'patient', email: `p${i}_${Date.now()}@gmail.com`
            }
        });
        patients.push(p);
    }

    // 4. BÁC SĨ (20)
    const doctors = [];
    for (let i = 1; i <= 20; i++) {
        const profile = await prisma.profile.create({
            data: { id: generateUUID(), fullName: `BS. ${randomName()}`, phone: `098${getRandomInt(1000000, 9999999)}`, role: 'doctor', email: `d${i}@hospital.vn` }
        });
        await prisma.doctor.create({
            data: { id: profile.id, specialtyId: getRandom(specialties).id, degree: getRandom(["Thạc sĩ", "Tiến sĩ", "BSCK II"]), experience: `${getRandomInt(5, 20)} năm` }
        });
        doctors.push(profile.id);
    }

    // 5. BỆNH & THUỐC (30)
    const medicines = [];
    for (let i = 1; i <= 30; i++) {
        const med = await prisma.medicine.create({ data: { id: generateUUID(), name: `Thuốc ${String.fromCharCode(65 + i % 26)}${i}`, medicineType: 'uống' } });
        medicines.push(med);
    }

    const diseaseIds = [];
    const names = ["Cảm cúm", "Dạ dày", "Huyết áp", "Tiểu đường", "Hen suyễn", "Xoang", "Gút", "Viêm gan", "Mất ngủ", "Sỏi thận"];
    for (let i = 0; i < 30; i++) {
        const d = await prisma.disease.create({
            data: { id: generateUUID(), name: `${getRandom(names)} ${i}`, categoryId: getRandom(categories).id, specialtyId: getRandom(specialties).id, symptoms: "..." }
        });
        diseaseIds.push(d.id);
        await prisma.diseaseMedicine.create({ data: { diseaseId: d.id, medicineId: getRandom(medicines).id } });
    }

    // 6. APPOINTMENTS (200) - TỪ 8 NGÀY TRƯỚC ĐẾN TƯƠNG LAI
    const appData = [];
    for (let i = 0; i < 200; i++) {
        const date = new Date();
        // Ngẫu nhiên từ -8 ngày đến +22 ngày
        date.setDate(date.getDate() + getRandomInt(-8, 22));

        appData.push({
            id: generateUUID(), patientId: getRandom(patients).id, doctorId: getRandom(doctors),
            date: date, shift: getRandomInt(1, 12), status: getRandom(['pending', 'confirmed', 'completed', 'cancelled']),
            reason: "Khám định kỳ"
        });
    }
    await prisma.appointment.createMany({ data: appData });

    // 7. USER EVENTS (1000) - CHỈ TRONG 8 NGÀY GẦN ĐÂY
    const EVENT_TYPES = ['VIEW_DOCTOR', 'VIEW_DISEASE', 'CHAT_AI_TOPIC', 'BOOK_APPOINTMENT', 'CANCEL_APPOINTMENT'];
    const eventData = [];
    for (let i = 0; i < 1000; i++) {
        const type = getRandom(EVENT_TYPES);
        const date = new Date();
        // Chỉ loanh quanh trong 8 ngày qua
        date.setDate(date.getDate() - getRandomInt(0, 8));
        date.setHours(getRandomInt(0, 23), getRandomInt(0, 59));

        let meta = {};
        if (type === 'VIEW_DOCTOR') meta = { doctorId: getRandom(doctors) };
        else if (type === 'VIEW_DISEASE') meta = { diseaseId: getRandom(diseaseIds) };
        else if (type === 'CHAT_AI_TOPIC') meta = { sessionId: generateUUID(), topic: "Sức khỏe" };
        else meta = { doctorId: getRandom(doctors), shift: getRandomInt(1, 12), date: date.toISOString().split('T')[0] };

        eventData.push({
            userId: Math.random() > 0.2 ? getRandom(patients).id : null,
            eventType: type, metadata: meta, createdAt: date
        });
    }
    await prisma.userEvent.createMany({ data: eventData.slice(0, 500) });
    await prisma.userEvent.createMany({ data: eventData.slice(500, 1000) });

    console.log("==================================================");
    console.log("🎉 SEEDING HOÀN TẤT VỚI MẬT ĐỘ CAO TRONG 8 NGÀY!");
    console.log("==================================================");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());