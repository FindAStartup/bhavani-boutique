import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import Drafts from './pages/Drafts';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import CategoryProducts from './pages/CategoryProducts';
import Wishlist from './pages/Wishlist';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminRoute from './components/auth/AdminRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/admin/drafts" element={<AdminRoute><Drafts /></AdminRoute>} />
        <Route path="/admin/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
