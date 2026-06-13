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
        } catch {
            setError("カテゴリ取得に失敗しました。");
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await categoryService.create(newName.trim());
            setNewName("");
            fetchCategories();
        } catch {
            setError("作成に失敗しました。");
        }
    };

    const editCategory = async () => {
        if (editingId === null) return;
        if (!editingName.trim()) return;
        try {
            await categoryService.update(editingId, editingName);
            setEditingId(null);
            setEditingName("");
            fetchCategories();
        } catch {
            setError('編集に失敗しました。');
            setEditingId(null);
            setEditingName("");
        }
    }

    const deleteCategory = async (id: number) => {
        if (!confirm("本当に削除しますか")) return;
        try {
            await categoryService.delete(id);
            fetchCategories();
        } catch {
            setError("削除に失敗しました。");
        }
    }

    return (
        <div>
            <h1 className="text-3xl">カテゴリ一覧</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>

                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <button type="submit">登録</button>
            </form>

            <table className="table-auto border-collapse w-full" >
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">カテゴリ名</th>
                        <th className="border px-4 py-2">編集</th>
                        <th className="border px-4 py-2">削除</th>
                    </tr>
                </thead>

                <tbody >
                    {categories.map((category) =>
                        <tr key={category.id}>
                            <td className="text-center align-middle border">
                                {editingId === category.id
                                    ? (

                                        <input className="bg-gray-200" type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                                    ) :
                                    (
                                        category.name
                                    )
                                }
                            </td>
                            {/* ２行目 */}
                            <td className="text-center align-middle border">
                                {editingId === category.id ? (
                                    <div className="flex justify-center gap-4">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={editCategory}>
                                            保存
                                        </button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => { setEditingId(null); setEditingName(""); }}>
                                            キャンセル
                                        </button>
                                    </div>
                                ) : (

                                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => { setEditingId(category.id); setEditingName(category.name); }}>編集</button>
                                )}
                            </td>
                            <td className="text-center align-middle border">
                                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteCategory(category.id)}>削除</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div >
    )
}
export default CategoryList;