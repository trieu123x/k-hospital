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

const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đoàn", "Trương", "Đinh", "Lâm"];
const tenDem = ["Văn", "Thị", "Minh", "Ngọc", "Hải", "Tuấn", "Phương", "Thảo", "Linh", "Quang", "Hữu", "Thanh", "Bảo", "Đức", "Gia", "Hoài", "Quốc", "Xuân", "Mỹ", "Kim"];
const ten = ["Anh", "Nam", "Trang", "Dũng", "Đạt", "Hà", "Hương", "Khang", "Khoa", "Phát", "Tâm", "Vy", "Yến", "Sơn", "Long", "Bình", "Châu", "Diệp", "Giang", "Hiếu"];
const randomName = () => `${getRandom(ho)} ${getRandom(tenDem)} ${getRandom(ten)}`;

// ==========================================
// DỮ LIỆU MẪU CHI TIẾT CHO BỆNH & THUỐC
// ==========================================
const DISEASE_DATA = [
    { name: "Cảm cúm", description: "Bệnh nhiễm trùng đường hô hấp do virus cúm gây ra, lây lan qua đường giọt bắn khi ho, hắt hơi.", symptoms: "Sốt cao 38-40°C, đau đầu, đau nhức cơ, mệt mỏi toàn thân, sổ mũi, nghẹt mũi, ho khan, đau rát họng", homeTreatment: "Nghỉ ngơi đầy đủ, uống nhiều nước ấm, súc miệng nước muối, xông hơi tinh dầu bạc hà, uống nước gừng mật ong" },
    { name: "Đau dạ dày", description: "Tình trạng viêm loét niêm mạc dạ dày, thường do vi khuẩn H. pylori hoặc sử dụng thuốc giảm đau kéo dài.", symptoms: "Đau thượng vị, ợ hơi, ợ chua, buồn nôn, đầy bụng sau ăn, nóng rát vùng ngực, chán ăn", homeTreatment: "Ăn uống đúng giờ, tránh đồ cay nóng và rượu bia, ăn cháo yến mạch, uống nước nghệ mật ong, nhai kỹ thức ăn" },
    { name: "Cao huyết áp", description: "Bệnh lý tim mạch mãn tính khi áp lực máu lên thành mạch liên tục ở mức cao (≥140/90 mmHg).", symptoms: "Đau đầu vùng gáy, hoa mắt chóng mặt, ù tai, mặt đỏ bừng, khó thở khi gắng sức, mệt mỏi", homeTreatment: "Giảm muối trong chế độ ăn, tập thể dục đều đặn, kiểm soát cân nặng, tránh stress, hạn chế rượu bia và thuốc lá" },
    { name: "Tiểu đường type 2", description: "Rối loạn chuyển hóa đường huyết do cơ thể không sản xuất đủ insulin hoặc kháng insulin.", symptoms: "Khát nước nhiều, tiểu nhiều lần, giảm cân không rõ nguyên nhân, mệt mỏi kéo dài, vết thương lâu lành, mờ mắt", homeTreatment: "Kiểm soát chế độ ăn ít đường tinh, tập thể dục 30 phút/ngày, theo dõi đường huyết thường xuyên, uống trà đắng hoặc trà lá dứa" },
    { name: "Hen suyễn", description: "Bệnh viêm mãn tính đường thở gây co thắt phế quản, khó thở và ho kéo dài.", symptoms: "Khó thở, thở khò khè, tức ngực, ho khan đặc biệt về đêm và sáng sớm, thở rít khi gắng sức", homeTreatment: "Tránh các tác nhân gây dị ứng (khói bụi, phấn hoa), giữ ấm cơ thể, tập thở sâu, uống nước gừng ấm, vệ sinh nhà cửa sạch sẽ" },
    { name: "Viêm xoang", description: "Tình trạng viêm niêm mạc xoang mũi do nhiễm trùng vi khuẩn, virus hoặc dị ứng.", symptoms: "Nghẹt mũi kéo dài, chảy dịch mũi đặc xanh/vàng, đau nhức vùng mặt và trán, giảm khứu giác, đau đầu, ho có đờm", homeTreatment: "Rửa mũi bằng nước muối sinh lý, xông hơi nóng, uống nhiều nước, kê cao đầu khi ngủ, tránh khói bụi ô nhiễm" },
    { name: "Gút (Gout)", description: "Bệnh viêm khớp do rối loạn chuyển hóa purin, gây tích tụ acid uric trong máu và kết tinh tại khớp.", symptoms: "Sưng đỏ nóng đau dữ dội tại khớp (thường ở ngón chân cái), cứng khớp, hạn chế vận động, cơn đau tái phát về đêm", homeTreatment: "Uống nhiều nước (2-3 lít/ngày), hạn chế thịt đỏ và hải sản, tránh rượu bia, ăn nhiều rau xanh và cherry, chườm đá khi đau" },
    { name: "Viêm gan B", description: "Bệnh nhiễm trùng gan do virus HBV gây ra, lây truyền qua đường máu và dịch cơ thể.", symptoms: "Mệt mỏi kéo dài, chán ăn, vàng da vàng mắt, nước tiểu sẫm màu, đau tức hạ sườn phải, buồn nôn", homeTreatment: "Nghỉ ngơi đầy đủ, ăn uống lành mạnh nhiều rau xanh, tránh rượu bia tuyệt đối, uống đủ nước, tránh tự ý dùng thuốc" },
    { name: "Mất ngủ mãn tính", description: "Rối loạn giấc ngủ kéo dài trên 3 tháng, ảnh hưởng nghiêm trọng đến sinh hoạt và sức khỏe.", symptoms: "Khó đi vào giấc ngủ, thức dậy nhiều lần trong đêm, dậy sớm không ngủ lại được, mệt mỏi ban ngày, khó tập trung, hay cáu gắt", homeTreatment: "Đi ngủ và thức dậy đúng giờ, tránh caffeine và màn hình điện tử trước khi ngủ, tập yoga hoặc thiền, uống trà hoa cúc, tắm nước ấm buổi tối" },
    { name: "Sỏi thận", description: "Sự hình thành tinh thể khoáng chất trong thận do nước tiểu cô đặc quá mức.", symptoms: "Đau quặn thắt lưng lan xuống bụng dưới và bẹn, tiểu buốt tiểu rắt, nước tiểu có máu hoặc đục, buồn nôn, sốt nếu có nhiễm trùng", homeTreatment: "Uống 2.5-3 lít nước/ngày, hạn chế muối và oxalat (rau bina, chocolate), uống nước chanh, vận động nhẹ nhàng đều đặn" },
    { name: "Viêm phổi", description: "Tình trạng nhiễm trùng nhu mô phổi do vi khuẩn, virus hoặc nấm gây ra, thường gặp ở người già và trẻ nhỏ.", symptoms: "Sốt cao, ho có đờm xanh hoặc vàng, khó thở, đau ngực khi hít thở sâu, mệt mỏi, ớn lạnh, ra mồ hôi nhiều", homeTreatment: "Nghỉ ngơi tuyệt đối, uống nhiều nước ấm, xông hơi, ăn cháo dinh dưỡng, giữ ấm ngực, hít thở sâu nhẹ nhàng" },
    { name: "Thiếu máu", description: "Tình trạng giảm hemoglobin hoặc hồng cầu trong máu dưới mức bình thường gây thiếu oxy cho cơ thể.", symptoms: "Da xanh xao nhợt nhạt, mệt mỏi kéo dài, hoa mắt chóng mặt, nhịp tim nhanh, khó thở khi gắng sức, móng tay giòn dễ gãy", homeTreatment: "Ăn nhiều thực phẩm giàu sắt (thịt bò, gan, rau bina), bổ sung vitamin C để hấp thu sắt, ăn đậu lăng và các loại đậu, tránh uống trà sát bữa ăn" },
    { name: "Thoái hóa cột sống", description: "Quá trình lão hóa tự nhiên của đĩa đệm và đốt sống gây đau nhức và hạn chế vận động.", symptoms: "Đau lưng hoặc cổ âm ỉ kéo dài, cứng khớp buổi sáng, tê bì tay chân, đau tăng khi cúi hoặc xoay người, yếu cơ", homeTreatment: "Tập vật lý trị liệu đều đặn, giữ tư thế đúng khi ngồi làm việc, chườm nóng khi đau, bơi lội, tránh mang vác nặng" },
    { name: "Vảy nến", description: "Bệnh tự miễn mãn tính gây tăng sinh tế bào da quá nhanh, tạo thành mảng đỏ có vảy trắng bạc.", symptoms: "Mảng da đỏ phủ vảy trắng bạc, ngứa nhiều, da khô nứt nẻ có thể chảy máu, sưng cứng khớp, móng bị biến dạng", homeTreatment: "Giữ ẩm da bằng kem dưỡng ẩm, tắm nước ấm với muối Epsom, tiếp xúc ánh nắng sáng vừa đủ, tránh stress, bôi gel nha đam" },
    { name: "Viêm dạ dày - tá tràng", description: "Bệnh viêm niêm mạc dạ dày và tá tràng (phần đầu ruột non) thường do vi khuẩn H.pylori.", symptoms: "Đau bụng thượng vị, nóng rát dạ dày, ợ hơi ợ chua, buồn nôn sau ăn, đầy hơi chướng bụng, phân đen nếu xuất huyết", homeTreatment: "Ăn ít chia nhiều bữa, tránh đồ cay chua chiên rán, uống nước nghệ tươi, nhai kỹ, không ăn quá no hoặc để bụng quá đói" },
];

const MEDICINE_DATA = [
    { name: "Paracetamol 500mg", ingredients: "Paracetamol 500mg, tinh bột ngô, acid stearic", dosage: "1-2 viên/lần, tối đa 8 viên/ngày, cách nhau ít nhất 4 giờ", usageInstruction: "Uống sau ăn với nước lọc, không dùng khi suy gan nặng", sideEffects: "Buồn nôn, phát ban, tổn thương gan khi dùng quá liều" },
    { name: "Amoxicillin 500mg", ingredients: "Amoxicillin trihydrate 500mg, magnesi stearat, lactose", dosage: "1 viên x 3 lần/ngày, uống liên tục 7-10 ngày", usageInstruction: "Uống trước hoặc sau ăn, uống đủ liệu trình kháng sinh", sideEffects: "Tiêu chảy, phát ban, buồn nôn, dị ứng nghiêm trọng ở người mẫn cảm penicillin" },
    { name: "Omeprazole 20mg", ingredients: "Omeprazole 20mg, mannitol, natri lauryl sulfat", dosage: "1 viên/ngày vào buổi sáng, liệu trình 2-8 tuần", usageInstruction: "Uống trước ăn sáng 30 phút, nuốt nguyên viên không nhai", sideEffects: "Đau đầu, tiêu chảy, đầy hơi, thiếu vitamin B12 khi dùng lâu dài" },
    { name: "Metformin 850mg", ingredients: "Metformin hydrochloride 850mg, povidon, magnesi stearat", dosage: "1 viên x 2 lần/ngày (sáng, tối)", usageInstruction: "Uống trong hoặc ngay sau bữa ăn để giảm kích ứng tiêu hóa", sideEffects: "Buồn nôn, tiêu chảy, vị kim loại trong miệng, nhiễm toan lactic (hiếm)" },
    { name: "Amlodipine 5mg", ingredients: "Amlodipine besylate 5mg, cellulose vi tinh thể, canxi hydrogen phosphat", dosage: "1 viên/ngày, uống vào thời điểm cố định", usageInstruction: "Uống với nước, có thể uống trước hoặc sau ăn, không ngừng đột ngột", sideEffects: "Phù mắt cá chân, đau đầu, chóng mặt, đỏ bừng mặt, mệt mỏi" },
    { name: "Salbutamol xịt 100mcg", ingredients: "Salbutamol sulfate 100mcg/nhát xịt, acid oleic, HFA-134a", dosage: "1-2 nhát xịt khi lên cơn, tối đa 8 nhát/ngày", usageInstruction: "Lắc kỹ trước khi xịt, hít sâu khi xịt, giữ hơi 10 giây rồi thở ra", sideEffects: "Tim đập nhanh, run tay, đau đầu, hạ kali máu khi dùng nhiều" },
    { name: "Colchicine 1mg", ingredients: "Colchicine 1mg, lactose monohydrate, tinh bột ngô", dosage: "1mg khi khởi phát cơn gút, sau đó 0.5mg mỗi 2-3 giờ (tối đa 6mg/đợt)", usageInstruction: "Uống ngay khi bắt đầu có triệu chứng, uống nhiều nước", sideEffects: "Tiêu chảy, buồn nôn, nôn, đau bụng, yếu cơ" },
    { name: "Cetirizine 10mg", ingredients: "Cetirizine dihydrochloride 10mg, lactose, cellulose vi tinh thể", dosage: "1 viên/ngày, tốt nhất uống buổi tối", usageInstruction: "Uống với nước, có thể uống trước hoặc sau ăn", sideEffects: "Buồn ngủ, khô miệng, đau đầu, mệt mỏi" },
    { name: "Diclofenac gel 1%", ingredients: "Diclofenac diethylamine 1%, isopropyl alcohol, carbomer", dosage: "Bôi 3-4 lần/ngày lên vùng đau, mỗi lần 2-4g", usageInstruction: "Bôi lên vùng da sạch, xoa nhẹ nhàng, rửa tay sau khi bôi, tránh tiếp xúc mắt", sideEffects: "Kích ứng da tại chỗ, phát ban, ngứa, khô da" },
    { name: "Vitamin B Complex", ingredients: "B1 10mg, B2 5mg, B3 50mg, B5 25mg, B6 10mg, B9 400mcg, B12 15mcg", dosage: "1 viên x 1-2 lần/ngày sau ăn", usageInstruction: "Uống sau ăn 30 phút với nước lọc", sideEffects: "Nước tiểu có thể chuyển màu vàng đậm, hiếm gặp buồn nôn" },
    { name: "Losartan 50mg", ingredients: "Losartan kali 50mg, cellulose vi tinh thể, lactose monohydrate", dosage: "1 viên/ngày, có thể tăng lên 100mg/ngày", usageInstruction: "Uống cùng thời điểm mỗi ngày, không phụ thuộc bữa ăn", sideEffects: "Tụt huyết áp, chóng mặt, tăng kali máu, đau cơ" },
    { name: "Pantoprazol 40mg", ingredients: "Pantoprazol natri sesquihydrate 40mg, mannitol, natri carbonat", dosage: "1 viên/ngày trước ăn sáng, liệu trình 4-8 tuần", usageInstruction: "Nuốt nguyên viên, không nhai hoặc nghiền, uống trước ăn 30 phút", sideEffects: "Đau đầu, đầy hơi, tiêu chảy, thiếu magiê khi dùng dài" },
    { name: "Prednisolone 5mg", ingredients: "Prednisolone 5mg, lactose, tinh bột ngô, magnesi stearat", dosage: "Liều theo chỉ định bác sĩ, thường 5-60mg/ngày chia 1-4 lần", usageInstruction: "Uống trong hoặc ngay sau bữa ăn để giảm kích ứng dạ dày, không ngừng đột ngột", sideEffects: "Tăng cân, mặt tròn (moon face), loãng xương, tăng đường huyết, suy tuyến thượng thận khi ngừng đột ngột" },
    { name: "Domperidon 10mg", ingredients: "Domperidon maleate 10mg, lactose monohydrate, tinh bột ngô", dosage: "1 viên x 3 lần/ngày, uống trước ăn 15-30 phút", usageInstruction: "Uống trước bữa ăn, không dùng quá 7 ngày liên tiếp nếu không có chỉ định", sideEffects: "Khô miệng, đau đầu, rối loạn kinh nguyệt, kéo dài QT trên ECG (hiếm)" },
    { name: "Sắt Fumarate 200mg", ingredients: "Sắt (II) fumarate 200mg (tương đương 66mg sắt nguyên tố), acid folic 0.5mg", dosage: "1 viên x 2 lần/ngày trước ăn 1 giờ hoặc sau ăn 2 giờ", usageInstruction: "Uống với nước cam hoặc nước chanh để tăng hấp thu, tránh uống cùng sữa hoặc trà", sideEffects: "Táo bón, phân đen, buồn nôn, đau bụng" },
];

async function main() {
    console.log("🚀 BẮT ĐẦU SEEDING DỮ LIỆU LỚN (8 NGÀY GẦN ĐÂY)...");

    // 0. DỌN DẸP
    console.log("🧹 Đang dọn dẹp Database...");
    await prisma.userEvent.deleteMany({});
    await prisma.notification.deleteMany({});
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
    await prisma.degree.deleteMany({});
    await prisma.medicineType.deleteMany({});
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

    // 3. BẰNG CẤP (Degree)
    console.log("🎓 Đang tạo bảng bằng cấp...");
    const degreeData = [
        { name: "Giáo sư", description: "Học hàm Giáo sư", rankWeight: 100 },
        { name: "Phó Giáo sư", description: "Học hàm Phó Giáo sư", rankWeight: 90 },
        { name: "Tiến sĩ", description: "Học vị Tiến sĩ Y khoa", rankWeight: 80 },
        { name: "Thạc sĩ", description: "Học vị Thạc sĩ Y khoa", rankWeight: 70 },
        { name: "BSCK II", description: "Bác sĩ Chuyên khoa II", rankWeight: 65 },
        { name: "BSCK I", description: "Bác sĩ Chuyên khoa I", rankWeight: 60 },
        { name: "Bác sĩ nội trú", description: "Bác sĩ nội trú bệnh viện", rankWeight: 50 },
        { name: "Cử nhân", description: "Cử nhân Y khoa", rankWeight: 40 },
    ];
    const degrees = [];
    for (const d of degreeData) {
        const degree = await prisma.degree.create({ data: d });
        degrees.push(degree);
    }

    // 4. LOẠI THUỐC (MedicineType)
    console.log("💊 Đang tạo bảng loại thuốc...");
    const medicineTypeData = [
        { name: "Thuốc uống", description: "Thuốc dùng đường uống (viên nén, viên nang, siro)" },
        { name: "Thuốc tiêm", description: "Thuốc dùng đường tiêm truyền (tiêm bắp, tĩnh mạch)" },
        { name: "Thuốc bôi", description: "Thuốc dùng ngoài da (kem, gel, mỡ)" },
        { name: "Thuốc xịt", description: "Thuốc dạng xịt (hít, xịt mũi, xịt họng)" },
        { name: "Thuốc nhỏ", description: "Thuốc nhỏ mắt, nhỏ tai, nhỏ mũi" },
        { name: "Thuốc đặt", description: "Thuốc đặt hậu môn, đặt âm đạo" },
        { name: "Thực phẩm chức năng", description: "Vitamin, khoáng chất, bổ sung dinh dưỡng" },
        { name: "Kháng sinh", description: "Thuốc kháng khuẩn, diệt vi khuẩn" },
        { name: "Giảm đau, hạ sốt", description: "Thuốc giảm đau không steroid và hạ sốt" },
        { name: "Kháng histamin", description: "Thuốc chống dị ứng, kháng histamin" },
    ];
    const medicineTypes = [];
    for (const mt of medicineTypeData) {
        const type = await prisma.medicineType.create({ data: mt });
        medicineTypes.push(type);
    }

    // Tạo map loại thuốc theo tên để gán chính xác cho từng thuốc
    const typeMap = {};
    for (const mt of medicineTypes) {
        typeMap[mt.name] = mt.id;
    }

    // 5. BỆNH NHÂN (100)
    console.log("🧍 Đang tạo 100 bệnh nhân...");
    const patients = [];
    for (let i = 1; i <= 100; i++) {
        const p = await prisma.profile.create({
            data: {
                id: generateUUID(), fullName: randomName(), phone: `090${getRandomInt(1000000, 9999999)}`,
                role: 'PATIENT', email: `p${i}_${Date.now()}@gmail.com`
            }
        });
        patients.push(p);
    }

    // 6. BÁC SĨ (50) — dùng degreeId FK
    console.log("👨‍⚕️ Đang tạo 50 bác sĩ...");
    const doctors = [];
    for (let i = 1; i <= 50; i++) {
        const profile = await prisma.profile.create({
            data: { id: generateUUID(), fullName: `BS. ${randomName()}`, phone: `098${getRandomInt(1000000, 9999999)}`, role: 'DOCTOR', email: `d${i}@hospital.vn` }
        });
        await prisma.doctor.create({
            data: {
                id: profile.id,
                specialtyId: getRandom(specialties).id,
                degreeId: getRandom(degrees).id,
                experience: `${getRandomInt(5, 25)} năm kinh nghiệm tại các bệnh viện tuyến trung ương`,
                education: getRandom([
                    "Đại học Y Hà Nội", "Đại học Y Dược TP.HCM",
                    "Đại học Y Dược Huế", "Đại học Y Dược Cần Thơ",
                    "Đại học Y khoa Phạm Ngọc Thạch", "Học viện Quân Y"
                ]),
                achievements: getRandom([
                    "Giải thưởng Thầy thuốc trẻ tiêu biểu 2023",
                    "Bằng khen Bộ Y tế về thành tích chuyên môn",
                    "Đề tài nghiên cứu cấp Nhà nước về Y học dự phòng",
                    "Chứng chỉ đào tạo nội soi tiêu hóa tại Nhật Bản",
                    "Giải nhất Hội nghị Khoa học trẻ ngành Y 2022",
                    null
                ])
            }
        });
        doctors.push(profile.id);
    }

    // 7. THUỐC (đầy đủ tất cả field) — dùng typeId FK
    console.log("💊 Đang tạo thuốc...");

    // Mapping từng thuốc sang loại thuốc phù hợp
    const medicineTypeMapping = [
        "Giảm đau, hạ sốt",  // Paracetamol
        "Kháng sinh",         // Amoxicillin
        "Thuốc uống",         // Omeprazole
        "Thuốc uống",         // Metformin
        "Thuốc uống",         // Amlodipine
        "Thuốc xịt",          // Salbutamol
        "Thuốc uống",         // Colchicine
        "Kháng histamin",     // Cetirizine
        "Thuốc bôi",          // Diclofenac gel
        "Thực phẩm chức năng",// Vitamin B
        "Thuốc uống",         // Losartan
        "Thuốc uống",         // Pantoprazol
        "Thuốc uống",         // Prednisolone
        "Thuốc uống",         // Domperidon
        "Thực phẩm chức năng",// Sắt Fumarate
    ];

    const medicines = [];
    for (let i = 0; i < MEDICINE_DATA.length; i++) {
        const md = MEDICINE_DATA[i];
        const med = await prisma.medicine.create({
            data: {
                id: generateUUID(),
                name: md.name,
                typeId: typeMap[medicineTypeMapping[i]] || getRandom(medicineTypes).id,
                ingredients: md.ingredients,
                dosage: md.dosage,
                usageInstruction: md.usageInstruction,
                sideEffects: md.sideEffects
            }
        });
        medicines.push(med);
    }

    // Thêm thêm 45 thuốc nữa để đủ 60, dùng dữ liệu random từ MEDICINE_DATA
    for (let i = 0; i < 45; i++) {
        const base = MEDICINE_DATA[i % MEDICINE_DATA.length];
        const suffix = `(Variant ${i + 1})`;
        const med = await prisma.medicine.create({
            data: {
                id: generateUUID(),
                name: `${base.name} ${suffix}`,
                typeId: getRandom(medicineTypes).id,
                ingredients: base.ingredients,
                dosage: base.dosage,
                usageInstruction: base.usageInstruction,
                sideEffects: base.sideEffects
            }
        });
        medicines.push(med);
    }

    // 8. BỆNH (đầy đủ tất cả field)
    console.log("🏥 Đang tạo bệnh...");
    const diseaseIds = [];

    // Tạo 15 bệnh gốc với dữ liệu chi tiết
    for (let i = 0; i < DISEASE_DATA.length; i++) {
        const dd = DISEASE_DATA[i];
        const d = await prisma.disease.create({
            data: {
                id: generateUUID(),
                name: dd.name,
                categoryId: getRandom(categories).id,
                specialtyId: getRandom(specialties).id,
                description: dd.description,
                symptoms: dd.symptoms,
                homeTreatment: dd.homeTreatment
            }
        });
        diseaseIds.push(d.id);

        // Gắn random 1-3 thuốc cho bệnh
        const numMeds = getRandomInt(1, 3);
        for (let j = 0; j < numMeds; j++) {
            await prisma.diseaseMedicine.create({ data: { diseaseId: d.id, medicineId: getRandom(medicines).id } }).catch(() => { });
        }
    }

    // Tạo thêm 45 bệnh variant để đủ 60
    for (let i = 0; i < 45; i++) {
        const base = DISEASE_DATA[i % DISEASE_DATA.length];
        const variant = `(Thể ${i + 16})`;
        const d = await prisma.disease.create({
            data: {
                id: generateUUID(),
                name: `${base.name} ${variant}`,
                categoryId: getRandom(categories).id,
                specialtyId: getRandom(specialties).id,
                description: base.description,
                symptoms: base.symptoms,
                homeTreatment: base.homeTreatment
            }
        });
        diseaseIds.push(d.id);

        const numMeds = getRandomInt(1, 3);
        for (let j = 0; j < numMeds; j++) {
            await prisma.diseaseMedicine.create({ data: { diseaseId: d.id, medicineId: getRandom(medicines).id } }).catch(() => { });
        }
    }

    // 9. APPOINTMENTS (400) — dùng enum status
    console.log("📅 Đang tạo 400 lịch khám...");
    const appData = [];
    for (let i = 0; i < 400; i++) {
        const date = new Date();
        date.setDate(date.getDate() + getRandomInt(-8, 22));

        appData.push({
            id: generateUUID(), patientId: getRandom(patients).id, doctorId: getRandom(doctors),
            date: date, shift: getRandomInt(1, 12), status: getRandom(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
            reason: getRandom([
                "Khám định kỳ",
                "Tái khám theo lịch hẹn",
                "Khám sức khỏe tổng quát",
                "Đau bụng kéo dài",
                "Ho sốt không giảm",
                "Kiểm tra kết quả xét nghiệm",
                "Đau lưng mãn tính",
                "Chóng mặt liên tục"
            ])
        });
    }
    await prisma.appointment.createMany({ data: appData });

    // 9.5 NOTIFICATIONS
    console.log("🔔 Đang tạo thông báo cho lịch khám...");
    const notifData = [];
    for (const app of appData) {
        // Thông báo cho Bệnh nhân
        notifData.push({
            id: generateUUID(),
            userId: app.patientId,
            appointmentId: app.id,
            title: "Cập nhật lịch hẹn",
            message: `Lịch hẹn khám của bạn vào ngày ${app.date.toISOString().split('T')[0]} (Ca ${app.shift}) đang ở trạng thái ${app.status}.`,
            isRead: Math.random() > 0.3,
            createdAt: new Date(app.date.getTime() - getRandomInt(1, 48) * 60 * 60 * 1000) // Tạo thông báo trước ngày khám 1-48 giờ
        });

        // Thông báo cho Bác sĩ
        notifData.push({
            id: generateUUID(),
            userId: app.doctorId,
            appointmentId: app.id,
            title: "Lịch hẹn bệnh nhân",
            message: `Bạn có 1 lịch hẹn khám vào ngày ${app.date.toISOString().split('T')[0]} (Ca ${app.shift}) với trạng thái ${app.status}.`,
            isRead: Math.random() > 0.5,
            createdAt: new Date(app.date.getTime() - getRandomInt(1, 48) * 60 * 60 * 1000)
        });
    }
    await prisma.notification.createMany({ data: notifData });

    // 10. USER EVENTS (3000)
    console.log("📊 Đang tạo 3000 User Events...");
    const EVENT_TYPES = ['VIEW_DOCTOR', 'VIEW_DOCTOR', 'VIEW_DISEASE', 'CHAT_AI_TOPIC', 'BOOK_APPOINTMENT', 'CANCEL_APPOINTMENT'];
    const CHAT_TOPICS = [
        "Da liễu", "Hô hấp", "Nội tổng quát", "Tim mạch", "Tiêu hóa",
        "Thần kinh", "Xương khớp", "Nhi khoa", "Phụ khoa", "Tai mũi họng",
        "Răng hàm mặt", "Mắt", "Dinh dưỡng", "Mất ngủ", "Giảm cân",
        "Huyết áp", "Tiểu đường", "Dị ứng", "Sốt", "Đau đầu"
    ];

    const eventData = [];
    for (let i = 0; i < 3000; i++) {
        const type = getRandom(EVENT_TYPES);
        const date = new Date();
        date.setDate(date.getDate() - getRandomInt(0, 8));
        date.setHours(getRandomInt(0, 23), getRandomInt(0, 59));

        let meta = {};
        if (type === 'VIEW_DOCTOR') meta = { doctorId: getRandom(doctors) };
        else if (type === 'VIEW_DISEASE') meta = { diseaseId: getRandom(diseaseIds) };
        else if (type === 'CHAT_AI_TOPIC') meta = { sessionId: generateUUID(), topic: getRandom(CHAT_TOPICS) };
        else {
            const appDate = new Date(date);
            appDate.setDate(appDate.getDate() + getRandomInt(1, 10));
            meta = { doctorId: getRandom(doctors), shift: getRandomInt(1, 12), date: appDate.toISOString().split('T')[0] };
        }

        eventData.push({
            userId: Math.random() > 0.25 ? getRandom(patients).id : null,
            eventType: type, metadata: meta, createdAt: date
        });
    }

    const size = 500;
    for (let i = 0; i < eventData.length; i += size) {
        const chunk = eventData.slice(i, i + size);
        await prisma.userEvent.createMany({ data: chunk });
        console.log(`   Đã insert ${i + chunk.length}/3000 events...`);
    }

    // 11. TIN TỨC (10 bài)
    console.log("📰 Đang tạo 10 tin tức mẫu...");
    const newsData = [
        { title: "Bệnh viện triển khai hệ thống khám bệnh trực tuyến", content: "Từ tháng 4/2026, bệnh viện chính thức ra mắt hệ thống đặt lịch khám trực tuyến giúp bệnh nhân dễ dàng đặt lịch, theo dõi kết quả xét nghiệm và nhận tư vấn y khoa từ xa thông qua nền tảng MediCare. Hệ thống tích hợp AI hỗ trợ sàng lọc triệu chứng ban đầu." },
        { title: "Hội thảo khoa học quốc tế về Tim mạch tại Việt Nam", content: "Hơn 200 chuyên gia y tế hàng đầu tham dự hội thảo thường niên về các phương pháp điều trị tim mạch tiên tiến, bao gồm can thiệp mạch vành qua da, phẫu thuật bắc cầu mạch vành, và ứng dụng AI trong chẩn đoán hình ảnh tim mạch." },
        { title: "Cập nhật phác đồ điều trị mới cho bệnh tiểu đường", content: "Bộ Y tế vừa ban hành phác đồ điều trị mới nhất cho bệnh tiểu đường type 2, nhấn mạnh vai trò của thuốc ức chế SGLT2 và GLP-1 agonist trong việc kiểm soát đường huyết và bảo vệ tim thận." },
        { title: "Chương trình tầm soát ung thư miễn phí cho phụ nữ", content: "Bệnh viện phối hợp với Quỹ hỗ trợ sức khỏe phụ nữ tổ chức chương trình tầm soát ung thư vú và cổ tử cung miễn phí trong tháng 4, dự kiến khám cho 5000 phụ nữ trên 35 tuổi." },
        { title: "Ứng dụng trí tuệ nhân tạo trong chẩn đoán bệnh da liễu", content: "Nghiên cứu mới chỉ ra rằng hệ thống AI có thể phân tích hình ảnh da liễu với độ chính xác trên 95%, hỗ trợ bác sĩ phát hiện sớm các dấu hiệu ung thư da melanoma và các bệnh da liễu phổ biến khác." },
        { title: "Phòng chống dịch bệnh mùa hè: Những điều cần biết", content: "Với thời tiết nóng ẩm mùa hè, nguy cơ bùng phát các bệnh truyền nhiễm như sốt xuất huyết, tay chân miệng, tiêu chảy cấp tăng cao. Chuyên gia khuyến cáo người dân cần chú ý vệ sinh an toàn thực phẩm và diệt muỗi." },
        { title: "Khánh thành trung tâm phẫu thuật robot hiện đại", content: "Bệnh viện vừa đưa vào hoạt động hệ thống phẫu thuật robot Da Vinci thế hệ mới nhất, cho phép thực hiện các ca phẫu thuật xâm lấn tối thiểu với độ chính xác cao trong các chuyên khoa Ngoại tổng quát, Tiết niệu và Phụ khoa." },
        { title: "Nghiên cứu mới về tác dụng của vi sinh đường ruột", content: "Các nhà khoa học phát hiện mối liên hệ mật thiết giữa hệ vi sinh đường ruột và sức khỏe tâm thần, mở ra hướng điều trị mới cho các rối loạn trầm cảm và lo âu thông qua điều chỉnh hệ vi sinh." },
        { title: "Bệnh viện đạt chứng chỉ chất lượng quốc tế JCI", content: "Sau 2 năm nỗ lực cải tiến chất lượng dịch vụ y tế, bệnh viện đã chính thức đạt chứng chỉ JCI (Joint Commission International) – tiêu chuẩn vàng trong quản lý chất lượng bệnh viện trên thế giới." },
        { title: "Hướng dẫn chăm sóc sức khỏe mùa dịch cúm A", content: "Trước tình hình dịch cúm A H1N1 có xu hướng gia tăng, bệnh viện khuyến cáo người dân cần tiêm phòng vắc-xin cúm, rửa tay thường xuyên, đeo khẩu trang nơi đông người và đến cơ sở y tế ngay khi có triệu chứng nghi ngờ." },
    ];

    for (const n of newsData) {
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - getRandomInt(0, 30));
        await prisma.news.create({
            data: {
                title: n.title,
                content: n.content,
                createdAt
            }
        });
    }

    console.log("==================================================");
    console.log("🎉 SEEDING HOÀN TẤT VỚI MẬT ĐỘ DỮ LIỆU LỚN!");
    console.log("==================================================");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());