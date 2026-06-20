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
            setCategories(data);
        } catch {
            setError("カテゴリ取得に失敗しました。");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            setError("編集に失敗しました。");
            setEditingId(null);
            setEditingName("");
        }
    };

    const deleteCategory = async (id: number) => {
        if (!confirm("本当に削除しますか")) return;
        try {
            await categoryService.delete(id);
            fetchCategories();
        } catch {
            setError("削除に失敗しました。");
        }
    };

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">カテゴリ管理</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* 追加フォーム */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="新しいカテゴリ名"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        追加
                    </button>
                </form>
            </div>

            {/* 一覧テーブル */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 font-medium">カテゴリ名</th>
                            <th className="px-4 py-3 font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-4 py-6 text-center text-gray-400">
                                    カテゴリが登録されていません
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {editingId === category.id ? (
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-800">{category.name}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingId === category.id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={editCategory}
                                                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                                                >
                                                    保存
                                                </button>
                                                <button
                                                    onClick={() => { setEditingId(null); setEditingName(""); }}
                                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                                >
                                                    キャンセル
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setEditingId(category.id); setEditingName(category.name); }}
                                                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => deleteCategory(category.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryList;
