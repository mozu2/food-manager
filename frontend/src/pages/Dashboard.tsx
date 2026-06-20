import { useEffect, useState } from "react";
import { itemService } from "../services/itemService";
import { UNIT_LABELS, type Item } from "../types";
import { Link } from "react-router-dom";

function Dashboard() {
    const [lowstocks, setLowstocks] = useState<Item[]>([]);
    const [error, setError] = useState("");
    const [expirings, setExpirings] = useState<Item[]>([]);

    const getExpiring = async () => {
        try {
            const data = await itemService.getExpiring();
            setExpirings(data);
        } catch {
            setError("データ取得に失敗しました。");
        }
    };

    const getLowStock = async () => {
        try {
            const data = await itemService.getLowStock();
            setLowstocks(data);
        } catch {
            setError("データ取得に失敗しました。");
        }
    };

    useEffect(() => {
        getLowStock();
        getExpiring();
    }, []);

    const ItemTable = ({ items }: { items: Item[] }) => (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 font-medium">食材名</th>
                        <th className="px-4 py-3 font-medium">残量</th>
                        <th className="px-4 py-3 font-medium">賞味期限</th>
                        <th className="px-4 py-3 font-medium">カテゴリ</th>
                        <th className="px-4 py-3 font-medium">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                                該当する食材はありません
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                <td className="px-4 py-3 text-gray-600">
                                    {item.quantity} {UNIT_LABELS[item.unit]}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {item.expirationDate
                                        ? new Date(item.expirationDate).toLocaleDateString("ja-JP")
                                        : "未設定"}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                                        {item.category.name}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        to={`/items/${item.id}/edit`}
                                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                                    >
                                        編集
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-5 bg-orange-400 rounded-full inline-block"></span>
                    <h2 className="text-lg font-semibold text-gray-700">賞味期限が近い食材</h2>
                    <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                        {expirings.length}件
                    </span>
                </div>
                <ItemTable items={expirings} />
            </section>

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-5 bg-red-400 rounded-full inline-block"></span>
                    <h2 className="text-lg font-semibold text-gray-700">在庫が少ない食材</h2>
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                        {lowstocks.length}件
                    </span>
                </div>
                <ItemTable items={lowstocks} />
            </section>
        </div>
    );
}

export default Dashboard;
