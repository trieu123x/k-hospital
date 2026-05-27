import { prisma } from "../configs/prisma-config.js";

export const profileRepository = {
    findById: async (id) => {
        return await prisma.profile.findUnique({
            where: { id },
            include: { doctor: true }
        });
    },

    findByPhone: async (phone) => {
        if (!phone) return null;
        return await prisma.profile.findFirst({
            where: { phone }
        });
    },

    findByEmail: async (email) => {
        if (!email) return null;
        return await prisma.profile.findFirst({
            where: { email }
        });
    },


    initDoctor: async ({ id, avatarUrl, avatarCropData }) => {
        return await prisma.profile.update({
            where: { id },
            data: {
                avatarUrl,
                avatarCropData,
                doctor: {
                    create: {}
                }
            }
        });
    }
};