export type Unit = "GRAM" | "ML" | "PIECE" | "BAG" | "BOTTLE" | "BOX";

export const UNIT_LABELS: Record<Unit, string> = {
    "GRAM": "g",
    "ML": "ml",
    "PIECE": "個",
    "BAG": "袋",
    "BOTTLE": "本",
    "BOX": "箱",
};

export type Category = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type Item = {
    id: number;
    name: string;
    categoryId: number;
    category: Category;
    quantity: number;
    unit: Unit;
    minimumQuantity: number | null;
    expirationDate: string | null;
    createdAt: string;
    updatedAt: string;

};

export type ApiResponse<T> = {
    success: boolean;
    data: T;
}