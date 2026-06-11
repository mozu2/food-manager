import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types";


function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            console.log("取得したデータ:", data);
            setCategories(data);
        } catch (error) {
            setError("カテゴリ取得に失敗しました。");
        }
    };

    const handleClick = async () => {
        if (!newName.trim()) return;
        try {
            await categoryService.create(newName.trim())
            setNewName("");
            fetchCategories();
        } catch {
            setError("作成に失敗しました。")
        }
    };


    return (
        <div>
            <h1>カテゴリ一覧</h1>
            <form action="">

                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <button type="submit" onClick={handleClick}>登録</button>
            </form>

            <ul>
                {categories.map((category) =>
                    <li key={category.id}>{category.name}</li>
                )}
            </ul>
        </div>
    )
}
export default CategoryList;