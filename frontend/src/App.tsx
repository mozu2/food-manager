import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ItemList from "./pages/ItemList";
import ItemForm from "./pages/ItemForm";
import CategoryList from "./pages/CategoryList";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
            ? "bg-emerald-100 text-emerald-700"
            : "text-gray-600 hover:bg-gray-100"
    }`;

function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen bg-gray-50">
                {/* サイドバー */}
                <aside className="w-60 bg-white border-r border-gray-200 fixed h-full flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-lg font-bold text-emerald-600">食材管理アプリ</h1>
                    </div>
                    <nav className="p-4 space-y-1 flex-1">
                        <NavLink to="/" end className={navLinkClass}>
                            ダッシュボード
                        </NavLink>
                        <NavLink to="/items" className={navLinkClass}>
                            食材一覧
                        </NavLink>
                        <NavLink to="/categories" className={navLinkClass}>
                            カテゴリ管理
                        </NavLink>
                    </nav>
                </aside>

                {/* メインコンテンツ */}
                <main className="ml-60 flex-1 p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/items" element={<ItemList />} />
                        <Route path="/items/new" element={<ItemForm />} />
                        <Route path="/items/:id/edit" element={<ItemForm />} />
                        <Route path="/categories" element={<CategoryList />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
