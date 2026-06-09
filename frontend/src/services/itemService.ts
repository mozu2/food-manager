import api from "./api";
import { ApiResponse, Item } from "../types";

export type ItemInput = {
    name: string;
    categoryId: number;
    quantity: number;
    unit: string;
    minimumQuantity?: number;
    expirationDate?: string;
};

export const itemService = {
    async getAll(categoryId?: number): Promise<Item[]> {
        const params = categoryId ? { categoryId } : {};
        const res = await api.get<ApiResponse<Item[]>>("/items", { params });
        return res.data.data;
    },

    async getlowStock(): Promise<Item[]> {
        const res = await api.get<ApiResponse<Item[]>>("/items/low-stock");
        return res.data.data;
    },

    async getExpiring(): Promise<Item[]> {
        const res = await api.get<ApiResponse<Item[]>>("/item/expiring");
        return res.data.data;
    },

    async create(data: ItemInput): Promise<Item> {
        const res = await api.post<ApiResponse<Item>>("/items", data);
        return res.data.data;
    },

    async update(id: number, data: Partial<ItemInput>): Promise<Item> {
        const res = await api.put<ApiResponse<Item>>(`/items/${id}`, data);
        return res.data.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/items/${id}`);
    },
}

