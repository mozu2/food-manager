import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ItemList from "./pages/ItemList";
import ItemForm from "./pages/ItemForm";
import CategoryList from "./pages/CategoryList";

function App() {
    return (
        <BrowserRouter>
            <div>
                <nav>
                    <Link to="/">ダッシュボード</Link>
                    <Link to="/items">食材一覧</Link>
                    <Link to="/categories">カテゴリ管理</Link>
                </nav>
                <main>
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