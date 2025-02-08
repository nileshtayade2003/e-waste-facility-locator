import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteAdmin = () => {
  const isAuth = !!localStorage.getItem('adminToken'); // Convert to boolean

  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRouteAdmin;
