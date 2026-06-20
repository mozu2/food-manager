import { useEffect, useState } from "react";
import { itemService } from "../services/itemService";
import { UNIT_LABELS, type Category, type Item } from "../types";
import Table from "../components/ui/Table";
import { Link } from "react-router-dom";
import { categoryService } from "../services/categoryService";

function ItemList() {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const [selectCategory, setSelectCategory] = useState<number | null>(null);

    useEffect(() => {
        fetchItemNames();
    }, []);

    const fetchItemNames = async (categoryId?: number) => {
        try {
            const itemsData = await itemService.getAll(categoryId);
            const categoriesData = await categoryService.getAll();
            setItems(itemsData);
            setCategories(categoriesData);
        } catch {
            setError("データ取得に失敗しました。");
        }
    };

    const deleteItem = async (id: number) => {
        if (!confirm("本当に削除しますか。")) return;
        try {
            await itemService.delete(id);
            fetchItemNames(selectCategory ?? undefined);
        } catch {
            setError("削除に失敗しました。");
        }
    };

    const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            const id = e.target.value ? Number(e.target.value) : undefined;
            setSelectCategory(id ?? null);
            const data = await itemService.getAll(id);
            setItems(data);
        } catch {
            setError("失敗しました。");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">食材一覧</h1>
                <Link
                    to="/items/new"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    + 食材を追加
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 font-medium">カテゴリで絞り込み：</label>
                <select
                    onChange={handleCategoryChange}
                    value={selectCategory ?? ""}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="">すべて</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <Table headers={["食材名", "カテゴリ", "残量", "賞味期限", "編集", "削除"]}>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                            食材が登録されていません
                        </td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                            <td className="px-4 py-3">
                                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                                    {item.category.name}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {item.quantity} {UNIT_LABELS[item.unit]}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {item.expirationDate
                                    ? new Date(item.expirationDate).toLocaleDateString("ja-JP")
                                    : "未設定"}
                            </td>
                            <td className="px-4 py-3">
                                <Link
                                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                                    to={`/items/${item.id}/edit`}
                                >
                                    編集
                                </Link>
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    onClick={() => deleteItem(item.id)}
                                >
                                    削除
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </Table>
        </div>
    );
}

export default ItemList;
