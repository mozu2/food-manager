import { useEffect, useState } from "react";
import { itemService } from "../services/itemService";
import { useNavigate, useParams } from "react-router-dom";
import type { Item } from "../types";


function ItemForm() {

    const { id } = useParams();
    const idParam = id ? Number(id) : undefined;
    const navigate = useNavigate();
    const [item, setItem] = useState<Item[]>([]);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        categoryId: 0,
        quantity: 0,
        unit: "GRAM",
        minimunQuantity: 0,
        expirationDate: "",
    })


    const fetchItem = async () => {
        try {
            const data = await itemService.getAll(idParam);
            setItem(data);
        } catch {
            setError("データ取得に失敗しました。")
        }

    }



    useEffect(() => {
        fetchItem();
    }, [])
    return (
        <>
            <h1>{id ? "食材を編集" : "食材を追加"}</h1>
            <form action="">
                <label htmlFor="">
                    食材名
                    <input type="text" value={item.name} />
                </label>
                <label htmlFor="">
                    カテゴリ
                    <input type="text" value={item.category.name} />
                </label>
                <label htmlFor="">
                    残量
                    <input type="text" value={item.quantity} />
                </label>
                <label htmlFor="">
                    単位
                    <input type="text" value={item.unit} />
                </label>
                <button type="submit">更新</button>
            </form>

        </>
    );
}
export default ItemForm;