import { useEffect, useState } from "react";
import { itemService } from "../services/itemService";
import { UNIT_LABELS, type Item } from "../types";
import Table from "../components/ui/Table";
import { Link } from "react-router-dom";

function ItemList() {

    const [items, setItems] = useState<Item[]>([]);
    const [error, setError] = useState("")
    const [selectCategory, setSelecCategory] = useState(null);
    useEffect(() => {
        fetchItemNames();
    })

    const fetchItemNames = async () => {
        try {
            const data = await itemService.getAll();
            console.log("取得したデータ:", data);
            setItems(data);
        } catch {
            setError("データ取得に失敗しました。")
        }

    };

    return (
        <>
            <h1>食材一覧</h1>
            <select>
                {items.map((item) =>
                    <option value={item.id}>{item.category.name}</option>
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
                        <td><Link to={`/item/${item.id}/edit`}>編集</Link></td>
                        <td><button>削除</button></td>
                    </tr>
                )}
            </Table>

        </>
    )
}
export default ItemList;
