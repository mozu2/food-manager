import prisma from "../lib/prisma";

type ItemInput = {
    name: string,
    categoryId: number;
    quantity: number; //量
    unit: string; //単位
    minimumQuantity?: number;
    expirationDate?: Date; //賞味期限
};

export const itemService = {
    async findAll(categoryId?: number) {
        return await prisma.item.findMany({
            where: categoryId ? { categoryId } : undefined,
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
    },

    async findById(id: number) {
        return await prisma.item.findUnique({
            where: { id },
            include: { category: true },
        });
    },

    async findLowStock() {
        return await prisma.item.findMany({
            where: {
                minimumQuantity: { not: null },
                AND: [
                    { minimumQuantity: { not: null } },
                ],
            },
            include: { category: true },
            orderBy: { quantity: "asc" },
        });
    },
}