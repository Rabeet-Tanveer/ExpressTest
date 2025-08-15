import './App.css';
import RegisterForm from './components/registrationform';
import LiveUserTable from './components/LiveUserTable';
import Login from './components/login';
import Dashboard from './components/dashboard';
import ProductList from './components/productlist';
import CartPage from './components/cart.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/" element={
          <div>
            <h1>Register</h1>
            <RegisterForm />
            <hr />
            <LiveUserTable />
          </div>
        } />
        {/* Redirect any unknown route to / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
