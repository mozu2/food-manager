import prisma from "../lib/prisma";

export const categoryService = {
    async findAll() {
        return await prisma.category.findMany({
            orderBy: { createdAt: "asc" },
        });
    },

    async findById(id: number) {
        return await prisma.category.findUnique({
            where: { id },
        });
    },

    async create(name: string) {
        return await prisma.category.create({
            data: { name },
        });
    },

    async update(id: number, name: string) {
        return await prisma.category.update({
            where: { id },
            data: { name },
        });
    },

    async delete(id: number) {
        return await prisma.category.delete({
            where: { id },
        });
    },
};