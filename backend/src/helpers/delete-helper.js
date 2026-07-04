import cron from 'node-cron';
import { prisma } from "../configs/prisma-config.js";

export const setupDeleteCronJob = () => {
  // Cron expression: "0 2 * * *" triggers at 2:00 AM every day
  cron.schedule("0 2 * * *", async () => {
    console.log("[CRON] Running database cleanup for soft-deleted items older than 30 days...");
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);

    try {
      // 1. Specialty
      const deletedSpecialties = await prisma.specialty.deleteMany({
        where: {
          deletedAt: {
            lt: thresholdDate
          }
        }
      });
      if (deletedSpecialties.count > 0) {
        console.log(`[CRON] Cleaned up ${deletedSpecialties.count} specialties.`);
      }

      // 2. Degree
      const deletedDegrees = await prisma.degree.deleteMany({
        where: {
          deletedAt: {
            lt: thresholdDate
          }
        }
      });
      if (deletedDegrees.count > 0) {
        console.log(`[CRON] Cleaned up ${deletedDegrees.count} degrees.`);
      }

      // 3. DiseaseCategory
      const deletedCategories = await prisma.diseaseCategory.deleteMany({
        where: {
          deletedAt: {
            lt: thresholdDate
          }
        }
      });
      if (deletedCategories.count > 0) {
        console.log(`[CRON] Cleaned up ${deletedCategories.count} disease categories.`);
      }

      // 4. MedicineType
      const deletedMedicineTypes = await prisma.medicineType.deleteMany({
        where: {
          deletedAt: {
            lt: thresholdDate
          }
        }
      });
      if (deletedMedicineTypes.count > 0) {
        console.log(`[CRON] Cleaned up ${deletedMedicineTypes.count} medicine types.`);
      }

      // 5. Disease
      const deletedDiseases = await prisma.disease.deleteMany({
        where: {
          deletedAt: {
            lt: thresholdDate
          }
        }
      });
      if (deletedDiseases.count > 0) {
        console.log(`[CRON] Cleaned up ${deletedDiseases.count} diseases.`);
      }

      // 6. Medicine
      const deletedMedicines = await prisma.medicine.deleteMany({
        where: {
          deletedAt: {
            lt: thresholdDate
          }
        }
      });
      if (deletedMedicines.count > 0) {
        console.log(`[CRON] Cleaned up ${deletedMedicines.count} medicines.`);
      }

      // 7. News
      const deletedNews = await prisma.news.deleteMany({
        where: {
          deletedAt: {
            lt: thresholdDate
          }
        }
      });
      if (deletedNews.count > 0) {
        console.log(`[CRON] Cleaned up ${deletedNews.count} news articles.`);
      }

    } catch (error) {
      console.error("[CRON] Error during soft-deleted items cleanup:", error);
    }
  });
};
