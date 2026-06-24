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
    async findAll(options: {
        categoryId?: number;
        keyword?: string;
        page: number;
        limit: number;
    }) {

        const { categoryId, keyword, page, limit } = options;

        const where = {
            categoryId: categoryId ?? undefined,
            name: keyword ? { contains: keyword } : undefined,
        }

        const total = await prisma.item.count({ where });

        const data = await prisma.item.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });

        return {
            items: data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
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

    async findExpiring() {
        const today = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(today.getDate() + 7);

        const items = await prisma.item.findMany({
            where: {
                expirationDate: {
                    not: null,
                    lte: sevenDaysLater,
                    gte: today,
                },
            },
            include: { category: true },
            orderBy: { expirationDate: "asc" },
        });

        return items.filter(
            (item) => item.minimumQuantity !== null && item.quantity <= item.minimumQuantity
        );
    },

    async create(data: ItemInput) {
        return await prisma.item.create({
            data,
            include: { category: true },
        });
    },

    async update(id: number, data: Partial<ItemInput>) {
        return await prisma.item.update({
            where: { id },
            data,
            include: { category: true }, //カテゴリがついてくる例）飲み物など￥
        });
    },

    async delete(id: number) {
        return await prisma.item.delete({
            where: { id },
        });
    },
};