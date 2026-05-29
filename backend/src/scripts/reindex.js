import "dotenv/config";
import { prisma } from "../configs/prisma-config.js";
import axios from "axios";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

async function reindex() {
  console.log("🚀 Bắt đầu quá trình re-index dữ liệu cho Chatbot...");

  // 1. Re-index Diseases
  console.log("\n--- 1. Re-indexing Diseases ---");
  const diseases = await prisma.disease.findMany();
  console.log(`Tìm thấy ${diseases.length} bệnh.`);
  
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    
    for (const disease of diseases) {
      try {
        console.log(`Processing disease: ${disease.name}`);
        const res = await axios.post(`${AI_SERVICE_URL}/ai/disease`, {
          content: disease.symptoms + " " + (disease.description || "")
        });
        await delay(2000);
        const chunks = res.data?.chunks;
      if (chunks && Array.isArray(chunks)) {
        // Clear old chunks
        await prisma.$executeRaw`DELETE FROM disease_chunks WHERE disease_id = ${disease.id}::uuid`;
        
        // Insert new chunks using Raw SQL for vector support
        for (const chunk of chunks) {
          const vectorString = `[${chunk.vector.join(',')}]`;
          await prisma.$executeRaw`
            INSERT INTO disease_chunks (id, disease_id, content, embedding)
            VALUES (gen_random_uuid(), ${disease.id}::uuid, ${chunk.content}, ${vectorString}::vector)
          `;
        }
        console.log(`   ✅ Saved ${chunks.length} chunks.`);
      }
    } catch (err) {
      console.error(`   ❌ Lỗi khi xử lý bệnh ${disease.name}:`, err.response?.data?.detail || err.message || err.code);
    }
  }

  // 2. Re-index Medicines
  console.log("\n--- 2. Re-indexing Medicines ---");
  const medicines = await prisma.medicine.findMany();
  console.log(`Tìm thấy ${medicines.length} loại thuốc.`);
  
  for (const med of medicines) {
    try {
      console.log(`Processing medicine: ${med.name}`);
      const res = await axios.post(`${AI_SERVICE_URL}/ai/disease/medicine`, {
        name: med.name,
        ingredients: med.ingredients || "",
        usage: med.usageInstruction || "",
        side_effects: med.sideEffects || ""
      });
      await delay(2000);
      const chunks = res.data?.chunks;
      if (chunks && Array.isArray(chunks)) {
        await prisma.$executeRaw`DELETE FROM medicine_chunks WHERE medicine_id = ${med.id}::uuid`;
        
        for (const chunk of chunks) {
          const vectorString = `[${chunk.vector.join(',')}]`;
          await prisma.$executeRaw`
            INSERT INTO medicine_chunks (id, medicine_id, content, embedding)
            VALUES (gen_random_uuid(), ${med.id}::uuid, ${chunk.content}, ${vectorString}::vector)
          `;
        }
        console.log(`   ✅ Saved ${chunks.length} chunks.`);
      }
    } catch (err) {
      console.error(`   ❌ Lỗi khi xử lý thuốc ${med.name}:`, err.response?.data?.detail || err.message || err.code);
    }
  }

  // 3. Re-index Doctors
  console.log("\n--- 3. Re-indexing Doctors ---");
  const doctors = await prisma.doctor.findMany({
    include: {
      profile: true,
      specialty: true
    }
  });
  console.log(`Tìm thấy ${doctors.length} bác sĩ.`);
  
  for (const doc of doctors) {
    try {
      console.log(`Processing doctor: ${doc.profile.fullName}`);
      const res = await axios.post(`${AI_SERVICE_URL}/ai/disease/doctor`, {
        name: doc.profile.fullName,
        specialty: doc.specialty?.name || "Y tế",
        experience: doc.experience || "",
        education: doc.education || ""
      });
      await delay(2000);
      const chunks = res.data?.chunks;
      if (chunks && Array.isArray(chunks)) {
        await prisma.$executeRaw`DELETE FROM doctor_chunks WHERE doctor_id = ${doc.id}::uuid`;
        
        for (const chunk of chunks) {
          const vectorString = `[${chunk.vector.join(',')}]`;
          await prisma.$executeRaw`
            INSERT INTO doctor_chunks (id, doctor_id, content, embedding)
            VALUES (gen_random_uuid(), ${doc.id}::uuid, ${chunk.content}, ${vectorString}::vector)
          `;
        }
        console.log(`   ✅ Saved ${chunks.length} chunks.`);
      }
    } catch (err) {
      console.error(`   ❌ Lỗi khi xử lý bác sĩ ${doc.profile.fullName}:`, err.message || err.code);
    }
  }

  console.log("\n✨ Hoàn tất quá trình re-index!");
  process.exit(0);
}

reindex().catch(err => {
  console.error("🔥 Lỗi nghiêm trọng:", err);
  process.exit(1);
});
