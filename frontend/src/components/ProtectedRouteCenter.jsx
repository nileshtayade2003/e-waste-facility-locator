import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteCenter = () => {
  const isAuth = !!localStorage.getItem('centerToken'); // Convert to boolean

  return isAuth ? <Outlet /> : <Navigate to="/center/login" replace />;
};

export default ProtectedRouteCenter;
