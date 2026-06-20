import { useEffect, useState } from "react";
import { itemService } from "../services/itemService";
import { useNavigate, useParams } from "react-router-dom";
import { categoryService } from "../services/categoryService";
import { VALID_UNITS, UNIT_LABELS, type Category } from "../types";

const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

function ItemForm() {
    const { id } = useParams();
    const idParam = id ? Number(id) : undefined;
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        categoryId: 0,
        quantity: 0,
        unit: "GRAM",
        minimumQuantity: 0,
        expirationDate: "",
    });

    const fetchItem = async (idParam: number) => {
        try {
            const data = await itemService.getById(idParam);
            setFormData({
                name: data.name,
                categoryId: data.category.id,
                quantity: data.quantity,
                unit: data.unit,
                minimumQuantity: data.minimumQuantity ?? 0,
                expirationDate: data.expirationDate ?? "",
            });
        } catch {
            setError("データ取得に失敗しました。");
        }
    };

    const getCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch {
            setError("データ取得に失敗しました。");
        }
    };

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (idParam) {
                await itemService.update(idParam, formData);
            } else {
                await itemService.create(formData);
            }
            navigate("/items");
        } catch {
            setError("エラーが発生しました");
        }
    };

    useEffect(() => {
        if (idParam) fetchItem(idParam);
        getCategories();
    }, []);

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {id ? "食材を編集" : "食材を追加"}
            </h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <form onSubmit={handleOnSubmit} className="space-y-4">
                    <div>
                        <label className={labelClass}>食材名</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>カテゴリ</label>
                        <select
                            className={inputClass}
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                        >
                            <option value={0}>選択してください</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className={labelClass}>残量</label>
                            <input
                                type="number"
                                className={inputClass}
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className={labelClass}>単位</label>
                            <select
                                className={inputClass}
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            >
                                {VALID_UNITS.map((unit) => (
                                    <option key={unit} value={unit}>{UNIT_LABELS[unit]}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>最低残量（警告の基準）</label>
                        <input
                            type="number"
                            className={inputClass}
                            value={formData.minimumQuantity}
                            onChange={(e) => setFormData({ ...formData, minimumQuantity: Number(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>賞味期限</label>
                        <input
                            type="date"
                            className={inputClass}
                            value={formData.expirationDate}
                            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {id ? "更新する" : "登録する"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/items")}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            キャンセル
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ItemForm;
