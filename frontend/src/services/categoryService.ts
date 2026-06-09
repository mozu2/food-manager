import api from "./api";
import { ApiResponse, Category } from "../types";

export default categoryService = {

    async getAll(): Promise<Category[]> {
        const res = await api.get<ApiResponse<Category[]>>("/categories");
        return res.data.data;
    },

    async create(name: string): Promise<Category> {
        const res = await api.post<ApiResponse<Category>>("/categories", { name });
        return res.data.data;
    },

    async update(id: number, name: string): Promise<Category> {
        const res = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name })
        return res.data.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/categories/${id}`)
    }
}