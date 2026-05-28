import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import { supabaseAdmin } from "../src/configs/supabase-config.js";
import crypto from "crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FIRST_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const MIDDLE_NAMES = ["Văn", "Thị", "Hữu", "Thanh", "Minh", "Thu", "Ngọc", "Hải", "Tuấn", "Đức", "Hoài", "Bảo", "Gia", "Khánh", "Phương", "Diệu", "Đan"];
const LAST_NAMES = ["An", "Anh", "Bình", "Cường", "Dũng", "Dương", "Hà", "Hải", "Hiếu", "Hòa", "Huy", "Hương", "Khang", "Khoa", "Kiên", "Linh", "Long", "Nam", "Nga", "Ngọc", "Nhân", "Nhi", "Phong", "Phúc", "Phương", "Quân", "Quang", "Tâm", "Thảo", "Thắng", "Thành", "Thủy", "Trang", "Trung", "Tuấn", "Tùng", "Uyên", "Vinh", "Vy", "Yến"];

function getRandomName() {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const middle = MIDDLE_NAMES[Math.floor(Math.random() * MIDDLE_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${first} ${middle} ${last}`;
}

function getRandomPhone() {
    const prefix = ["03", "05", "07", "08", "09"];
    const p = prefix[Math.floor(Math.random() * prefix.length)];
    const tail = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `${p}${tail}`;
}

const DOCTOR_AVATARS = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80",
    "https://images.unsplash.com/photo-1594824436998-f54e17e4bb72?w=500&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80",
    "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&q=80",
    "https://images.unsplash.com/photo-1582750433449-648ed127ae8e?w=500&q=80",
    "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=500&q=80"
];

const PATIENT_AVATARS = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
    null, null, null, null // Để tạo bệnh nhân ngẫu nhiên không có avatar
];

const SPECIALTIES = [
    { name: "Nội khoa", basePrice: 150000, description: "Khám và điều trị các bệnh lý nội khoa tổng quát, tim mạch, tiêu hóa không cần phẫu thuật. Ứng dụng phác đồ chuẩn mực quốc tế." },
    { name: "Ngoại khoa", basePrice: 200000, description: "Phẫu thuật ngoại khoa, chấn thương chỉnh hình, mổ nội soi, điều trị khối u và dị tật bẩm sinh bằng công nghệ cao." },
    { name: "Nhi khoa", basePrice: 120000, description: "Chuyên sâu về sức khỏe trẻ sơ sinh và trẻ nhỏ. Tư vấn dinh dưỡng, tiêm chủng, theo dõi sự phát triển thể chất và tinh thần." },
    { name: "Sản phụ khoa", basePrice: 180000, description: "Dịch vụ khám thai, quản lý thai nghén, tầm soát ung thư cổ tử cung và tư vấn kế hoạch hóa gia đình." },
    { name: "Da liễu", basePrice: 150000, description: "Chẩn đoán bệnh lý da liễu, viêm da, nấm, vảy nến, rụng tóc. Có khoa da liễu thẩm mỹ trị liệu mụn nám, chống lão hóa." },
    { name: "Tim mạch", basePrice: 250000, description: "Siêu âm tim, đo điện tâm đồ, theo dõi huyết áp. Chuyên gia hàng đầu trong can thiệp mạch vành và phẫu thuật tim mạch." },
    { name: "Thần kinh", basePrice: 200000, description: "Điều trị động kinh, đột quỵ, rối loạn giấc ngủ, bệnh Parkinson và các hội chứng đau đầu mãn tính, đau dây thần kinh." },
    { name: "Tai Mũi Họng", basePrice: 150000, description: "Nội soi tai mũi họng, chẩn đoán sớm ung thư vòm họng. Điều trị viêm xoang mạn, viêm amidan, cấy ốc tai điện tử." },
    { name: "Răng Hàm Mặt", basePrice: 150000, description: "Nha khoa tổng quát, cấy ghép Implant, niềng răng trong suốt Invisalign, phẫu thuật chỉnh hình xương hàm." },
    { name: "Mắt", basePrice: 150000, description: "Đo khúc xạ, khám chuyên sâu võng mạc, mổ đục thủy tinh thể Phaco, phẫu thuật tật khúc xạ Lasik, Femto." },
];

const DEGREES = [
    { name: "Bác sĩ Đa khoa", rankWeight: 10, description: "Tốt nghiệp bác sĩ y khoa 6 năm." },
    { name: "Thạc sĩ", rankWeight: 30, description: "Học vị Thạc sĩ y học sau đại học." },
    { name: "Tiến sĩ", rankWeight: 50, description: "Học vị Tiến sĩ y học, chuyên gia nghiên cứu." },
    { name: "Giáo sư", rankWeight: 100, description: "Giáo sư y học hàng đầu, có nhiều đóng góp nghiên cứu." },
    { name: "Phó Giáo sư", rankWeight: 80, description: "Chuyên gia y tế cấp cao, giảng viên đại học y." },
    { name: "Bác sĩ CKI", rankWeight: 20, description: "Bác sĩ chuyên khoa cấp 1, có chuyên môn lâm sàng." },
    { name: "Bác sĩ CKII", rankWeight: 40, description: "Bác sĩ chuyên khoa cấp 2, kinh nghiệm lâm sàng sâu." }
];

const CATEGORIES = [
    { name: "Bệnh Truyền Nhiễm", description: "Bao gồm các bệnh lây lan qua vi khuẩn, virus, nấm và ký sinh trùng, thường có tính lây nhiễm cao." },
    { name: "Bệnh Mãn Tính", description: "Bệnh lý phát triển kéo dài, đòi hỏi việc điều trị và theo dõi liên tục trong nhiều tháng hoặc suốt đời." },
    { name: "Bệnh Tiêu Hóa", description: "Nhóm bệnh lý liên quan trực tiếp đến hệ thống tiêu hóa từ dạ dày, đại tràng đến gan, tụy mật." },
    { name: "Bệnh Hô Hấp", description: "Những bệnh lý ảnh hưởng đến đường hô hấp dưới và trên, bao gồm phổi, phế quản và thanh quản." },
    { name: "Bệnh Tim Mạch", description: "Hệ thống tim mạch bị ảnh hưởng, làm giảm khả năng tuần hoàn máu và dễ dẫn tới các biến chứng cấp tính." }
];

const MEDICINE_TYPES = [
    { name: "Thuốc kháng sinh", description: "Dùng để tiêu diệt hoặc kìm hãm sự phát triển của vi khuẩn, điều trị các bệnh lý nhiễm trùng cấp tính." },
    { name: "Thuốc giảm đau hạ sốt", description: "Làm giảm triệu chứng đau nhức và hạ thân nhiệt khi bị sốt mà không điều trị nguyên nhân." },
    { name: "Thuốc tim mạch", description: "Ổn định huyết áp, trợ tim, chống đông máu, ngăn ngừa nhồi máu cơ tim và đột quỵ." },
    { name: "Thuốc tiêu hóa", description: "Trung hòa acid dạ dày, hỗ trợ men tiêu hóa, chống viêm loét và hội chứng ruột kích thích." },
    { name: "Vitamin & Khoáng chất", description: "Bổ sung vi chất dinh dưỡng, tăng cường hệ miễn dịch và phục hồi sức khỏe tổng thể." }
];

const DISEASES = [
    { name: "Viêm Dạ Dày Cấp", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=1", description: "Viêm dạ dày cấp là tình trạng sưng viêm niêm mạc dạ dày xảy ra đột ngột. Bệnh có thể do nhiễm vi khuẩn H.pylori, dùng thuốc giảm đau lạm dụng, hoặc do thói quen ăn uống không khoa học, uống nhiều rượu bia, căng thẳng kéo dài. Nếu không được điều trị kịp thời có thể dẫn đến loét và xuất huyết dạ dày.", symptoms: "Đau rát vùng thượng vị dữ dội hoặc âm ỉ, buồn nôn hoặc nôn mửa liên tục. Cảm giác đầy hơi chướng bụng, ợ chua, chán ăn, đi ngoài phân đen nếu có dấu hiệu xuất huyết tiêu hóa bên trong.", homeTreatment: "Chuyển sang chế độ ăn thức ăn lỏng, mềm, chia nhỏ bữa ăn. Kiêng tuyệt đối đồ cay nóng, nhiều mỡ, rượu bia. Dành thời gian nghỉ ngơi tĩnh dưỡng, tránh thức khuya và giải tỏa căng thẳng tâm lý." },
    { name: "Cao Huyết Áp", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=2", description: "Cao huyết áp (tăng huyết áp) là bệnh lý mãn tính khi áp lực máu tác động lên thành động mạch liên tục ở mức cao (thường từ 140/90 mmHg trở lên). Bệnh được mệnh danh là 'kẻ giết người thầm lặng' vì diễn tiến âm thầm và gây ra vô vàn biến chứng nguy hiểm cho tim, não, thận và mắt.", symptoms: "Đau đầu dữ dội vùng gáy, chóng mặt hoa mắt khi đứng lên ngồi xuống đột ngột. Chảy máu cam không rõ nguyên nhân, đánh trống ngực, khó thở, đỏ bừng mặt, ù tai và mệt mỏi.", homeTreatment: "Áp dụng chế độ ăn nhạt (DASH), giảm lượng muối hàng ngày. Tập thể dục đều đặn 30 phút mỗi ngày. Hạn chế sử dụng đồ uống có cồn, bỏ hút thuốc lá. Theo dõi huyết áp tại nhà hàng ngày." },
    { name: "Tiểu Đường Type 2", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=3", description: "Tiểu đường Type 2 là bệnh rối loạn chuyển hóa mạn tính, đặc trưng bởi tình trạng đường huyết luôn ở mức cao do cơ thể đề kháng với insulin hoặc tuyến tụy không sản xuất đủ lượng insulin cần thiết. Bệnh liên quan mật thiết đến thừa cân, béo phì và lười vận động.", symptoms: "Liên tục khát nước và uống rất nhiều nước, đi tiểu nhiều lần (nhất là ban đêm). Cảm giác đói cồn cào liên tục, giảm cân không kiểm soát dù ăn nhiều. Mờ mắt, vết thương chậm lành, tê bì châm chích bàn tay chân.", homeTreatment: "Tuân thủ nghiêm ngặt chế độ ăn ít tinh bột và đường, bổ sung rau xanh và chất xơ. Đi bộ hoặc tập thể dục nhẹ nhàng đều đặn. Uống đủ nước, có thể dùng trà khổ qua, lá dứa hỗ trợ ổn định đường huyết." },
    { name: "Hen Suyễn Mãn Tính", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=4", description: "Hen suyễn là bệnh lý viêm mạn tính của đường hô hấp, khiến phế quản bị phù nề, co thắt và tăng tiết dịch nhầy. Bệnh thường bị kích phát bởi các yếu tố dị ứng như thời tiết lạnh, khói bụi, phấn hoa, lông động vật hoặc căng thẳng thần kinh.", symptoms: "Cơn khó thở, thở rít, thở khò khè đặc biệt dữ dội về đêm hoặc gần sáng. Cảm giác nặng ngực như có vật nặng đè lên. Ho khan hoặc ho có đờm trắng dính kéo dài, suy giảm thể lực khi gắng sức.", homeTreatment: "Giữ không gian sống sạch sẽ, thoáng mát, không có lông thú cưng hoặc nấm mốc. Luôn mang theo ống hít cắt cơn bên mình. Giữ ấm vùng cổ ngực khi trời lạnh. Tránh tuyệt đối khói thuốc lá." },
    { name: "Viêm Xoang Mũi", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=5", description: "Viêm xoang mũi là tình trạng viêm nhiễm màng niêm mạc lót trong lòng các xoang quanh mũi, làm tăng tiết dịch và tắc nghẽn lỗ thông xoang. Nguyên nhân phổ biến là do vi khuẩn, virus sau đợt cảm cúm, hoặc do dị ứng thời tiết và ô nhiễm không khí.", symptoms: "Nghẹt mũi, chảy nước mũi dịch đặc có màu vàng hoặc xanh. Đau nhức vùng trán, hai bên má hoặc giữa hai mắt, đau lan lên đỉnh đầu. Giảm hoặc mất hoàn toàn khứu giác, ho có đờm, hơi thở có mùi hôi.", homeTreatment: "Rửa mũi bằng nước muối sinh lý ấm mỗi ngày 2-3 lần. Xông hơi bằng tinh dầu tràm hoặc xả chanh để làm thông thoáng đường thở. Uống nhiều nước ấm để làm loãng dịch nhầy, tránh nằm đầu quá thấp khi ngủ." },
    { name: "Bệnh Gút (Gout)", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=6", description: "Bệnh Gút là một thể viêm khớp cực kỳ đau đớn, do sự tích tụ và kết tinh của axit uric dư thừa tại các khớp xương. Bệnh thường khởi phát đột ngột vào ban đêm và liên quan trực tiếp tới rối loạn chuyển hóa nhân purin từ chế độ ăn uống thừa đạm.", symptoms: "Sưng, nóng, đỏ, đau dữ dội tại các khớp, phổ biến nhất là khớp ngón chân cái. Đau đến mức không thể chạm vào nhẹ nhàng. Cơn đau kéo dài nhiều ngày và sau đó da vùng khớp có thể bong tróc, ngứa rát.", homeTreatment: "Uống nhiều nước lọc (2-3 lít/ngày) để tăng đào thải axit uric. Chườm lạnh vùng khớp đang sưng viêm để giảm đau tạm thời. Tuyệt đối kiêng rượu bia, nội tạng động vật, hải sản và thịt đỏ." },
    { name: "Viêm Gan B", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=7", description: "Viêm gan B là một căn bệnh nhiễm trùng gan nguy hiểm do virus HBV gây ra. Virus lây truyền chủ yếu qua đường máu, quan hệ tình dục và từ mẹ sang con. Bệnh có thể tiến triển thành xơ gan hoặc ung thư gan nếu không được theo dõi và điều trị kịp thời.", symptoms: "Giai đoạn đầu thường không có triệu chứng rõ ràng. Khi virus bùng phát, người bệnh thấy mệt mỏi cùng cực, chán ăn, buồn nôn, đau tức vùng mạn sườn phải. Vàng da, vàng lòng trắng mắt, nước tiểu sẫm màu như nước vối.", homeTreatment: "Nghỉ ngơi tĩnh dưỡng tuyệt đối trong giai đoạn cấp bùng phát. Tránh mọi loại thuốc hoặc thực phẩm chức năng không có chỉ định (để giảm tải cho gan). Ăn thức ăn thanh đạm, kiêng rượu bia vĩnh viễn." },
    { name: "Sỏi Thận", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=8", description: "Sỏi thận hình thành khi các khoáng chất trong nước tiểu lắng đọng và kết tinh lại thành các khối cứng trong thận hoặc niệu quản. Quá trình này thường do uống quá ít nước, ăn quá mặn hoặc do bất thường cấu trúc đường tiết niệu.", symptoms: "Cơn đau quặn thận xuất phát từ thắt lưng lan dọc xuống bụng dưới và bẹn. Tiểu buốt, tiểu rắt, nước tiểu đục hoặc có lẫn máu. Buồn nôn, nôn mửa, sốt và ớn lạnh nếu sỏi gây tắc nghẽn và nhiễm trùng.", homeTreatment: "Tăng cường uống rất nhiều nước (trên 2.5 lít/ngày) để bào mòn và tống sỏi nhỏ ra ngoài. Uống thêm nước chanh hoặc cam tươi. Vận động, đi bộ nhẹ nhàng. Tránh các thực phẩm chứa nhiều oxalate như cải bó xôi, trà đặc." },
    { name: "Thoái Hóa Cột Sống", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=9", description: "Thoái hóa cột sống là quá trình lão hóa tự nhiên, sụn khớp và đĩa đệm bị mất nước, mòn đi, kèm theo sự hình thành gai xương. Bệnh gây chèn ép rễ thần kinh, làm ảnh hưởng nghiêm trọng đến sinh hoạt và khả năng lao động.", symptoms: "Đau lưng hoặc cổ âm ỉ, cứng khớp vào buổi sáng sớm, phải vận động một lúc mới giãn ra. Cơn đau lan xuống mông đùi hoặc tê bì hai cánh tay. Cơ bắp yếu dần, hạn chế tầm vận động khi cúi hoặc xoay người.", homeTreatment: "Thực hiện các bài tập vật lý trị liệu, yoga, bơi lội để giãn cơ. Tránh cúi gập lưng mang vác vật nặng. Chườm nóng vùng lưng/cổ khi bị cứng cơ. Ngủ trên nệm phẳng cứng vừa phải, thay đổi tư thế thường xuyên." },
    { name: "Thiếu Máu (Anemia)", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=10", description: "Thiếu máu là tình trạng giảm số lượng hồng cầu khỏe mạnh hoặc nồng độ hemoglobin trong máu dưới mức bình thường. Nguyên nhân phổ biến nhất là do thiếu sắt, mất máu rỉ rả, hoặc chế độ dinh dưỡng nghèo nàn, dẫn đến cơ thể không được cung cấp đủ oxy.", symptoms: "Làn da tái nhợt, xanh xao, niêm mạc mắt nhợt nhạt. Cơ thể thường xuyên mệt mỏi, hụt hơi khi leo cầu thang hoặc gắng sức. Hoa mắt, chóng mặt khi đứng dậy, nhịp tim đập nhanh, chân tay lạnh, rụng tóc nhiều.", homeTreatment: "Bổ sung thực phẩm giàu chất sắt như thịt bò, gan động vật, các loại đậu, rau lá xanh đậm. Uống thêm nước cam hoặc thực phẩm giàu Vitamin C cùng bữa ăn để tăng cường hấp thu sắt. Tránh uống trà hoặc cà phê ngay sau bữa ăn." },
    { name: "Suy Tim", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=11", description: "Tình trạng tim không đủ khả năng bơm máu đi nuôi cơ thể, dẫn đến ứ đọng máu ở phổi.", symptoms: "Khó thở khi gắng sức hoặc khi nằm, phù chân, mệt mỏi.", homeTreatment: "Hạn chế muối trong khẩu phần ăn, dùng thuốc đúng chỉ định." },
    { name: "Sốt Xuất Huyết", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=12", description: "Bệnh truyền nhiễm cấp tính do virus Dengue lây qua muỗi vằn.", symptoms: "Sốt cao đột ngột 39-40 độ, đau hốc mắt, phát ban đỏ dưới da.", homeTreatment: "Uống nhiều nước, dùng Paracetamol để hạ sốt." },
    { name: "Trầm Cảm", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=13", description: "Rối loạn tâm trạng gây ra cảm giác buồn bã kéo dài, mất hứng thú.", symptoms: "Mất ngủ hoặc ngủ quá nhiều, chán ăn, suy nghĩ tiêu cực.", homeTreatment: "Tập thiền, chia sẻ với người thân, tránh áp lực." },
    { name: "Máu Nhiễm Mỡ", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=14", description: "Tình trạng chỉ số Cholesterol hoặc Triglyceride vượt quá mức an toàn.", symptoms: "Thường không có triệu chứng rõ ràng cho đến khi gây biến chứng.", homeTreatment: "Giảm đồ chiên xào nhiều dầu mỡ, ăn nhiều rau xanh, tập thể dục." },
    { name: "Viêm Phế Quản", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=15", description: "Viêm lớp niêm mạc ống phế quản, diễn biến cấp hoặc mạn tính.", symptoms: "Ho có đờm nhiều, khó thở, tức ngực, sốt nhẹ.", homeTreatment: "Uống nhiều nước ấm, giữ ấm cơ thể, tránh xa khói thuốc lá." },
    { name: "Viêm Khớp Dạng Thấp", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=16", description: "Bệnh lý tự miễn dịch mạn tính làm tổn thương màng hoạt dịch khớp.", symptoms: "Sưng nóng đỏ đau các khớp nhỏ ở bàn tay, cứng khớp.", homeTreatment: "Chườm nóng hoặc lạnh để giảm sưng, nghỉ ngơi hợp lý." },
    { name: "Béo Phì", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=17", description: "Tình trạng mỡ thừa tích tụ ảnh hưởng xấu đến sức khỏe.", symptoms: "Tăng cân mất kiểm soát, khó thở khi vận động, mệt mỏi.", homeTreatment: "Giảm lượng calo tiêu thụ, tăng cường vận động." },
    { name: "Trào Ngược Dạ Dày", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=18", description: "Axit dạ dày trào ngược lên thực quản gây kích ứng.", symptoms: "Ợ hơi, ợ chua, nóng rát ngực, đau họng mãn tính.", homeTreatment: "Không nằm ngay sau khi ăn, kê cao gối khi ngủ." },
    { name: "Đục Thủy Tinh Thể", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=19", description: "Tình trạng mờ đục của thể thủy tinh trong mắt.", symptoms: "Nhìn mờ, nhạy cảm với ánh sáng, thấy quầng sáng.", homeTreatment: "Đeo kính râm, ăn nhiều thực phẩm giàu vitamin A." },
    { name: "Động Kinh", imageUrl: "https://loremflickr.com/500/500/hospital,disease?lock=20", description: "Rối loạn hệ thần kinh trung ương do hoạt động não bất thường.", symptoms: "Co giật, mất ý thức tạm thời, lú lẫn.", homeTreatment: "Tuân thủ dùng thuốc đúng giờ, tránh các yếu tố kích hoạt." }
];

const MEDICINES = [
    { name: "Paracetamol 500mg Extra", imageUrl: "https://loremflickr.com/500/500/pill?lock=1", ingredients: "Paracetamol 500mg, Caffeine 65mg, Tinh bột ngô, Magnesi stearat", dosage: "Người lớn và trẻ em trên 12 tuổi: 1-2 viên/lần, không quá 8 viên/ngày. Khoảng cách giữa các lần uống tối thiểu 4-6 giờ.", usageInstruction: "Uống thuốc với nhiều nước lọc, sau bữa ăn nhẹ. Tránh uống khi bụng quá đói. Đối với người có bệnh lý về gan, cần giảm liều theo chỉ định của bác sĩ.", sideEffects: "Sử dụng đúng liều thường rất an toàn. Dùng quá liều hoặc dùng chung với rượu bia có thể gây hoại tử tế bào gan không hồi phục. Đôi khi gây mẩn ngứa, phát ban dị ứng nhẹ." },
    { name: "Amoxicillin 500mg", imageUrl: "https://loremflickr.com/500/500/pill?lock=2", ingredients: "Amoxicillin trihydrate tương đương 500mg Amoxicillin khan, Crospovidone, Colloidal silicon dioxide", dosage: "Người lớn: 1 viên 500mg x 3 lần/ngày. Trẻ em: Tính liều theo cân nặng (25-50mg/kg/ngày). Liệu trình kéo dài từ 5 - 7 ngày tùy bệnh.", usageInstruction: "Uống thuốc trước hoặc sau bữa ăn đều được vì sự hấp thu không bị ảnh hưởng bởi thức ăn. Phải uống đủ và dứt điểm toàn bộ liệu trình kháng sinh để tránh tình trạng vi khuẩn kháng thuốc.", sideEffects: "Tiêu chảy, rối loạn tiêu hóa nhẹ do mất cân bằng hệ vi sinh đường ruột. Buồn nôn, phát ban ngoài da. Có nguy cơ sốc phản vệ ở người dị ứng với dòng penicillin (cần ngưng ngay lập tức)." },
    { name: "Omeprazole 20mg", imageUrl: "https://loremflickr.com/500/500/pill?lock=3", ingredients: "Omeprazole 20mg bào chế dạng vi hạt bao tan trong ruột, Mannitol, Natri lauryl sulfat", dosage: "Điều trị loét dạ dày: 1 viên/ngày trong 4-8 tuần. Trào ngược dạ dày thực quản: 1 viên/ngày trong 4 tuần.", usageInstruction: "Uống nguyên viên với một ly nước lớn, KHÔNG ĐƯỢC NHAI hoặc NGHIỀN NÁT viên thuốc. Thời điểm vàng để uống là trước bữa ăn sáng 30 phút để thuốc phát huy tác dụng khóa bơm proton tối đa.", sideEffects: "Thường gặp: Nhức đầu, buồn ngủ nhẹ, táo bón hoặc tiêu chảy. Dùng kéo dài trên 1 năm có nguy cơ làm giảm hấp thu Canxi và Vitamin B12, gây tăng nguy cơ gãy xương và thiếu máu." },
    { name: "Metformin 850mg", imageUrl: "https://loremflickr.com/500/500/pill?lock=4", ingredients: "Metformin hydrochloride 850mg, Povidon K30, Magnesi stearat, Hydroxypropyl methylcellulose", dosage: "Khởi đầu 1 viên/ngày. Sau đó có thể tăng lên 1 viên x 2 lần/ngày (sáng, tối) tùy theo đáp ứng đường huyết của bệnh nhân.", usageInstruction: "Uống NGAY TRONG hoặc SAU KHI ĂN no để giảm thiểu tối đa tác dụng phụ trên hệ tiêu hóa. Đừng bao giờ nhịn đói khi uống thuốc vì nguy cơ tụt đường huyết đột ngột.", sideEffects: "Cảm giác buồn nôn, tiêu chảy, có vị kim loại khó chịu trong miệng, đầy bụng. Biến chứng hiếm gặp nhưng rất nguy hiểm là nhiễm toan lactic (đặc biệt ở người suy giảm chức năng thận)." },
    { name: "Amlodipine 5mg", imageUrl: "https://loremflickr.com/500/500/pill?lock=5", ingredients: "Amlodipine besylate tương đương 5mg Amlodipine, Cellulose vi tinh thể, Canxi hydrogen phosphat khan", dosage: "Bắt đầu với 1 viên 5mg/ngày, uống vào một thời điểm cố định trong ngày. Có thể tăng tối đa lên 10mg/ngày theo chỉ định.", usageInstruction: "Thuốc có tác dụng chậm và kéo dài, nên thiết lập báo thức để uống đúng giờ mỗi ngày. Có thể uống trước hoặc sau khi ăn đều không ảnh hưởng đến sự hấp thu. KHÔNG uống chung với nước ép bưởi chùm.", sideEffects: "Phù nề ở vùng mắt cá chân và bàn chân (rất phổ biến). Có thể gây đau đầu, chóng mặt, đỏ bừng mặt, hồi hộp đánh trống ngực trong thời gian đầu mới sử dụng thuốc." },
    { name: "Salbutamol Xịt 100mcg", imageUrl: "https://loremflickr.com/500/500/pill?lock=6", ingredients: "Salbutamol sulfate 100mcg cho mỗi nhát xịt, chất khí đẩy HFA-134a an toàn cho tầng ozone", dosage: "Cắt cơn hen cấp: Xịt 1-2 nhát. Phòng ngừa cơn hen do gắng sức: Xịt 2 nhát trước khi vận động 15 phút. Tối đa không quá 8 nhát xịt/ngày.", usageInstruction: "Lắc thật kỹ bình xịt trước khi dùng. Thở ra từ từ, ngậm kín ống ngậm, ấn bình xịt ĐỒNG THỜI hít vào thật sâu và chậm. Nín thở trong 10 giây để thuốc lắng đọng sâu trong phổi, sau đó thở ra chậm.", sideEffects: "Gây nhịp tim nhanh, đánh trống ngực, run rẩy các đầu ngón tay. Đau nhức đầu, khô miệng họng. Nếu lạm dụng xịt quá nhiều có thể gây hạ kali máu dẫn đến chuột rút và rối loạn nhịp tim nghiêm trọng." },
    { name: "Ibuprofen 400mg", imageUrl: "https://loremflickr.com/500/500/pill?lock=7", ingredients: "Ibuprofen 400mg", dosage: "1 viên/lần khi đau", usageInstruction: "Sau ăn no", sideEffects: "Đau dạ dày" },
    { name: "Aspirin 81mg", imageUrl: "https://loremflickr.com/500/500/pill?lock=8", ingredients: "Aspirin 81mg", dosage: "1 viên/ngày", usageInstruction: "Sau ăn", sideEffects: "Nguy cơ xuất huyết" },
    { name: "Losartan 50mg", imageUrl: "https://loremflickr.com/500/500/pill?lock=9", ingredients: "Losartan potassium 50mg", dosage: "1 viên/ngày", usageInstruction: "Cùng hoặc không cùng thức ăn", sideEffects: "Chóng mặt" },
    { name: "Cefuroxime 500mg", imageUrl: "https://loremflickr.com/500/500/pill?lock=10", ingredients: "Cefuroxime axetil 500mg", dosage: "1 viên x 2 lần/ngày", usageInstruction: "Sau ăn", sideEffects: "Buồn nôn, tiêu chảy" }
];

const NEWS = Array(20).fill(null).map((_, i) => ({
    title: `Cập Nhật Kiến Thức Y Khoa Tuần ${i + 1}: ${["Đột Phá Mới Trong Điều Trị Ung Thư", "Hiểu Đúng Về Bệnh Tiểu Đường", "Cảnh Báo Đợt Bùng Phát Sốt Xuất Huyết", "Hướng Dẫn Chăm Sóc Sức Khỏe Mùa Lạnh", "Lợi Ích Của Việc Khám Sức Khỏe Định Kỳ"][i % 5]}`,
    newUrl: `https://loremflickr.com/800/400/hospital,news?lock=${i}`,
    content: `Sức khỏe là tài sản vô giá của con người. Trong bản tin tuần này, chúng tôi xin mang đến những kiến thức y khoa chuyên sâu và cập nhật nhất để giúp bạn và gia đình bảo vệ sức khỏe toàn diện. Những năm gần đây, khoa học đã chứng kiến nhiều bước tiến vượt bậc trong chẩn đoán và điều trị bệnh lý phức tạp. \n\nCác chuyên gia y tế khuyến cáo, việc phòng bệnh luôn phải được ưu tiên hàng đầu. Một chế độ ăn uống cân bằng giàu chất xơ, vitamin, ít muối và đường kết hợp với vận động đều đặn 30 phút mỗi ngày sẽ giúp giảm 50% nguy cơ mắc các bệnh lý mãn tính. Ngoài ra, việc duy trì lịch khám sức khỏe định kỳ mỗi 6 tháng là lá chắn thép giúp phát hiện sớm các dấu hiệu bất thường, từ đó tối ưu hóa phác đồ điều trị và giảm thiểu chi phí y tế. \n\nHãy nhớ rằng, y học dù có tiến bộ đến đâu thì ý thức tự giác bảo vệ sức khỏe của chính mỗi người vẫn là liều thuốc hữu hiệu nhất. K-Hospital luôn đồng hành cùng bạn trên hành trình chăm sóc sức khỏe chất lượng cao, với đội ngũ chuyên gia tận tâm và hệ thống trang thiết bị hiện đại bậc nhất. Xin cảm ơn quý độc giả đã theo dõi bản tin y tế định kỳ của chúng tôi. Chúc quý vị một ngày thật nhiều năng lượng và an lành!`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
}));

async function seed() {
    console.log("==========================================");
    console.log("🚀 BẮT ĐẦU QUÁ TRÌNH SEEDING DỮ LIỆU KHỦNG");
    console.log("==========================================\n");

    // 1. DELETE OLD DATA
    console.log("🧹 Đang dọn dẹp dữ liệu cũ (Xóa theo thứ tự Ràng buộc Khóa ngoại)...");
    await prisma.userEvent.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chatSession.deleteMany();
    await prisma.medicalRecord.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.doctorLeave.deleteMany();
    await prisma.diseaseMedicine.deleteMany();
    await prisma.medicineChunk.deleteMany();
    await prisma.medicine.deleteMany();
    await prisma.diseaseChunk.deleteMany();
    await prisma.disease.deleteMany();
    await prisma.doctorChunk.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.news.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.specialty.deleteMany();
    await prisma.diseaseCategory.deleteMany();
    await prisma.degree.deleteMany();
    await prisma.medicineType.deleteMany();
    console.log("✅ Dọn dẹp xong.\n");

    // 2. INSERT MASTER DATA
    console.log("📦 Đang chèn Master Data...");
    const createdSpecialties = await Promise.all(SPECIALTIES.map(s => prisma.specialty.create({ data: s })));
    const createdDegrees = await Promise.all(DEGREES.map(d => prisma.degree.create({ data: d })));
    const createdCategories = await Promise.all(CATEGORIES.map(c => prisma.diseaseCategory.create({ data: c })));
    const createdMedTypes = await Promise.all(MEDICINE_TYPES.map(m => prisma.medicineType.create({ data: m })));
    console.log("✅ Đã tạo Chuyên khoa, Bằng cấp, Danh mục Bệnh và Thuốc.\n");

    // 3. CREATE DOCTORS
    console.log("👨‍⚕️ Đang khởi tạo 60 Bác sĩ bằng tài khoản thực trên Supabase Auth...");
    const doctors = [];
    for (let i = 0; i < 60; i++) {
        const fullName = getRandomName();
        const phone = getRandomPhone();
        const email = `doctor_${crypto.randomUUID().substring(0, 8)}@medicare.com`;
        const avatar = `https://i.pravatar.cc/500?img=${(i % 70) + 1}`;
        const specialty = createdSpecialties[Math.floor(Math.random() * createdSpecialties.length)];
        const degree = createdDegrees[Math.floor(Math.random() * createdDegrees.length)];

        try {
            const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password: "Password123!",
                user_metadata: { full_name: fullName, phone, role: "DOCTOR" },
                email_confirm: true,
                phone_confirm: true,
            });

            if (error) throw error;
            const userId = authData.user.id;

            let retries = 10;
            let profile = null;
            while (retries > 0 && !profile) {
                await delay(500); // Chờ DB Trigger handle_new_user chạy
                profile = await prisma.profile.findUnique({ where: { id: userId } });
                retries--;
            }

            if (profile) {
                await prisma.profile.update({
                    where: { id: userId },
                    data: { avatarUrl: avatar, dob: new Date("1980-01-01"), address: "Hà Nội" }
                });

                const docRecord = await prisma.doctor.create({
                    data: {
                        id: userId,
                        specialtyId: specialty.id,
                        degreeId: degree.id,
                        experience: `Hơn ${Math.floor(Math.random() * 20) + 5} năm kinh nghiệm công tác tại bệnh viện tuyến trung ương. Đã trực tiếp điều trị và phẫu thuật thành công hàng ngàn ca bệnh khó. Tích cực tham gia các hội thảo y khoa quốc tế nhằm cập nhật những phương pháp điều trị tiên tiến nhất hiện nay.`,
                        education: `Tốt nghiệp loại Giỏi chuyên ngành ${specialty.name} tại Đại học Y Hà Nội. Hoàn thành khóa đào tạo chuyên sâu và nội trú chuyên khoa tại các bệnh viện danh tiếng ở Pháp và Mỹ, liên tục tham gia nghiên cứu khoa học.`,
                        achievements: `Bác sĩ xuất sắc năm 2021, 2022. Chủ nhiệm 3 đề tài nghiên cứu cấp bộ về y học hiện đại, có hàng chục bài báo quốc tế uy tín. Nhận bằng khen của Bộ Y tế vì sự nghiệp chăm sóc sức khỏe nhân dân.`
                    }
                });
                doctors.push(userId);
            }
            process.stdout.write("⚕️ ");
        } catch (err) {
            console.log(`Lỗi khi tạo BS ${email}: ${err.message}`);
        }
    }
    console.log(`\n✅ Đã tạo thành công ${doctors.length} Bác sĩ.\n`);

    // 4. CREATE PATIENTS
    console.log("🧍 Đang khởi tạo 80 Bệnh nhân bằng tài khoản thực trên Supabase Auth...");
    const patients = [];
    for (let i = 0; i < 80; i++) {
        const fullName = getRandomName();
        const phone = getRandomPhone();
        const email = `patient_${crypto.randomUUID().substring(0, 8)}@gmail.com`;
        const avatar = `https://i.pravatar.cc/500?img=${(i % 70) + 11}`;

        try {
            const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password: "Password123!",
                user_metadata: { full_name: fullName, phone, role: "PATIENT" },
                email_confirm: true,
                phone_confirm: true,
            });

            if (error) throw error;
            const userId = authData.user.id;

            let retries = 10;
            let profile = null;
            while (retries > 0 && !profile) {
                await delay(500);
                profile = await prisma.profile.findUnique({ where: { id: userId } });
                retries--;
            }

            if (profile) {
                if (avatar) {
                    await prisma.profile.update({
                        where: { id: userId },
                        data: { avatarUrl: avatar, dob: new Date("1995-05-15"), address: "Hồ Chí Minh" }
                    });
                }
                patients.push(userId);
            }
            process.stdout.write("🧍");
        } catch (err) {
            console.log(`Lỗi khi tạo BN ${email}: ${err.message}`);
        }
    }
    console.log(`\n✅ Đã tạo thành công ${patients.length} Bệnh nhân.\n`);

    // 5. CREATE DISEASES
    console.log("🦠 Đang chèn 60 Bệnh lý y khoa...");
    const createdDiseases = [];
    for (let i = 0; i < 60; i++) {
        const d = DISEASES[i % DISEASES.length];
        const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
        const specialty = createdSpecialties[Math.floor(Math.random() * createdSpecialties.length)];
        const disease = await prisma.disease.create({
            data: {
                ...d,
                name: `${d.name} ${i > 9 ? `(Biến thể ${i})` : ''}`,
                categoryId: category.id,
                specialtyId: specialty.id,
                nameClean: `${d.name} ${i > 9 ? `(Biến thể ${i})` : ''}`
            }
        });
        createdDiseases.push(disease.id);
    }
    console.log("✅ Xong Bệnh lý.\n");

    // 6. CREATE MEDICINES
    console.log("💊 Đang chèn 40 Loại thuốc...");
    const createdMedicines = [];
    for (let i = 0; i < 40; i++) {
        const m = MEDICINES[i % MEDICINES.length];
        const type = createdMedTypes[Math.floor(Math.random() * createdMedTypes.length)];
        const medicine = await prisma.medicine.create({
            data: {
                ...m,
                name: `${m.name} ${i > 5 ? `(Mẫu ${i})` : ''}`,
                typeId: type.id
            }
        });
        createdMedicines.push(medicine.id);

        // Relate medicine to 1-2 random diseases
        const diseaseId = createdDiseases[Math.floor(Math.random() * createdDiseases.length)];
        await prisma.diseaseMedicine.create({
            data: { diseaseId, medicineId: medicine.id }
        });
    }
    console.log("✅ Xong Thuốc.\n");

    // 7. CREATE APPOINTMENTS
    console.log("📅 Đang tạo 30 Lịch khám & Hồ sơ bệnh án...");
    const statuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    const appData = [];
    for (let i = 0; i < 30; i++) {
        const doctorId = doctors[Math.floor(Math.random() * doctors.length)];
        const patientId = patients[Math.floor(Math.random() * patients.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const shift = Math.floor(Math.random() * 10) + 1; // shift 1 - 10

        const randomDays = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
        const date = new Date();
        date.setDate(date.getDate() + randomDays);

        const appt = await prisma.appointment.create({
            data: {
                doctorId, patientId, date, shift, status,
                reason: "Tôi cảm thấy mệt mỏi, đau nhức kéo dài, mong bác sĩ tư vấn và khám tổng quát."
            }
        });

        appData.push({ ...appt, date });

        if (status === "COMPLETED") {
            await prisma.medicalRecord.create({
                data: {
                    appointmentId: appt.id,
                    diagnosis: "Phát hiện dấu hiệu viêm nhẹ mạn tính, cơ thể suy nhược do áp lực công việc và thức khuya.",
                    prescription: "Paracetamol 500mg, Vitamin tổng hợp B-Complex, nghỉ ngơi tĩnh dưỡng, uống nhiều nước ấm.",
                    note: "Tái khám sau 2 tuần nếu triệu chứng không thuyên giảm. Chú ý chế độ dinh dưỡng giàu chất xơ."
                }
            });
        }
    }
    console.log("✅ Xong Lịch khám.\n");

    // 8. CREATE EVENTS
    console.log("📊 Đang tạo 1000 User Events (Log tracking)...");
    const eventTypes = ["VIEW_DOCTOR", "BOOK_APPOINTMENT", "CANCEL_APPOINTMENT", "VIEW_DISEASE", "CHAT_AI_TOPIC"];
    const eventsToInsert = [];

    for (let i = 0; i < 1000; i++) {
        const evType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const uId = patients[Math.floor(Math.random() * patients.length)];
        // +/- 5 days in milliseconds
        const offsetMs = (Math.floor(Math.random() * 11) - 5) * 24 * 60 * 60 * 1000;
        const evtDate = new Date(Date.now() + offsetMs);

        let metadata = { source: "web", duration: Math.floor(Math.random() * 300) };
        if (evType === "VIEW_DOCTOR" || evType === "BOOK_APPOINTMENT" || evType === "CANCEL_APPOINTMENT") {
            metadata.doctorId = doctors[Math.floor(Math.random() * doctors.length)];
            if (evType !== "VIEW_DOCTOR") {
                metadata.shift = Math.floor(Math.random() * 10) + 1;
            }
        } else if (evType === "VIEW_DISEASE") {
            metadata.diseaseId = createdDiseases[Math.floor(Math.random() * createdDiseases.length)];
        } else if (evType === "CHAT_AI_TOPIC") {
            const topics = ["Tim mạch", "Tiêu hóa", "Hô hấp", "Nhi khoa", "Da liễu"];
            metadata.topic = topics[Math.floor(Math.random() * topics.length)];
            metadata.sessionId = crypto.randomUUID();
        }

        eventsToInsert.push({
            userId: uId,
            eventType: evType,
            createdAt: evtDate,
            metadata: metadata
        });
    }
    await prisma.userEvent.createMany({ data: eventsToInsert });
    console.log("✅ Xong Log Events.\n");

    // 9. CREATE NEWS
    console.log("📰 Đang tạo 20 Bài viết tin tức y tế...");
    await prisma.news.createMany({ data: NEWS });
    console.log("✅ Xong Tin tức.\n");

    console.log("==========================================");
    console.log("🎉 SEEDING THÀNH CÔNG RỰC RỠ!!!");
    console.log("📢 Bạn có thể chạy lại lệnh `npm run reindex` để nạp dữ liệu vào Vector AI.");
    console.log("==========================================\n");
}

seed().catch(e => {
    console.error("🔥 LỖI NGHIÊM TRỌNG TRONG QUÁ TRÌNH SEEDING:", e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});