import { useEffect, useState } from "react";
import { itemService } from "../services/itemService";
import { UNIT_LABELS, type Category, type Item } from "../types";
import Table from "../components/ui/Table";
import { Link } from "react-router-dom";
import { categoryService } from "../services/categoryService";

function ItemList() {

    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("")
    const [selectCategory, setSelectCategory] = useState<number | null>(null);
    useEffect(() => {
        fetchItemNames();
    }, []);

    const fetchItemNames = async (categoryId?: number) => {
        try {
            const itemsData = await itemService.getAll(categoryId);
            const categoriesData = await categoryService.getAll();
            console.log("取得したデータ:", itemsData);
            setItems(itemsData);
            setCategories(categoriesData);
        } catch {
            setError("データ取得に失敗しました。")
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
    }

    return (
        <>
            <h1>食材一覧</h1>
            <select onChange={handleCategoryChange}>
                <option value="">すべて</option>
                {categories.map((category) =>
                    <option key={category.id} value={category.id} >{category.name}</option>
                )}
            </select>
            <p>{error}</p>
            <Table headers={["食材", "カテゴリ", "残量", "賞味期限", "編集", "削除"]}>
                {items.map((item) =>
                    <tr key={item.id}>
                        <td>
                            {item.name}
                        </td>
                        <td> {item.category.name}</td>
                        <td> {item.quantity} {UNIT_LABELS[item.unit]}</td>
                        <td> {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString("ja-JP") : "未設定"}</td>
                        <td><Link className="bg-blue-500 text-white px-2 py-1 rounded" to={`/items/${item.id}/edit`}>編集</Link></td>
                        <td><button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteItem(item.id)}>削除</button></td>
                    </tr>
                )}
            </Table>

        </>
    )
}
export default ItemList;
