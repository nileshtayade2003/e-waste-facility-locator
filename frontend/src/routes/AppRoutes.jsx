import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminLayout from '../components/admin/AdminLayout';
import ManageUsers from '../pages/Admin/ManageUsers';
import AllCenters from '../pages/admin/AllCenters';
import AddCenter from '../pages/admin/AddCenter';
import UserHome from '../pages/User/Home';
import Articles from '../pages/User/Articles';
import BookAppointment from '../pages/User/BookAppointment';
import CenterLogin from '../pages/center/CenterLogin';
import ECenterDashboard from '../pages/center/Dashboard';
import ManageAppointments from '../pages/center/ManageAppointments';
import HeaderFooter from '../pages/user/HeaderFooter';
import NotFoundPage from '../components/NotFoundPage';
import ECenterLayout from '../components/e-center/ECenterLayout';
import ProtectedRouteAdmin from '../components/ProtectedRouteAdmin';
import ProtectedRouteCenter from '../components/ProtectedRouteCenter';
import Dashboard from '../pages/center/Dashboard';
import Customers from '../pages/center/Customers';


import { useState } from 'react';
import UserLogin from '../pages/user/UserLogin';
import RegisterUser from '../pages/user/RegisterUser';
import { UserProvider } from '../context/UserContext';
import Logout from '../pages/user/Logout';
import Appointments from '../pages/user/Appointments';
import Settings from '../pages/center/Settings';
import CenterProductPage from '../pages/center/CenterProductPage';
import UserProductPage from '../pages/user/UserProductPage';
import UserPurchasesPage from '../pages/user/UserPurchasesPage';

function AppRoutes() {
  const isAdminAuthenticated = localStorage.getItem('adminToken'); // Check admin auth
  const isCenterAuthenticated =localStorage.getItem('centerToken'); // Check center auth



  return (
    <Router>  
       <UserProvider>
       <Routes>
          {/* Public Routes */}
            <Route path="/" element={<HeaderFooter />}>
      
              <Route index element={<UserHome />} />
              <Route path="book-appointment/:centerId" element={<BookAppointment />} />
              <Route path="articles" element={<Articles />} />
              <Route path="my-appointments" element={<Appointments />} />
              <Route path="products" element={<UserProductPage />} />
              <Route path="my-purchases" element={<UserPurchasesPage />} />
              <Route path="login" element={<UserLogin />} />
              <Route path="logout" element={<Logout />} />
              <Route path="register" element={<RegisterUser />} />
            </Route>

          {/* Admin Panel */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRouteAdmin isAuth={isAdminAuthenticated} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="all-centers" element={<AllCenters />} />
              <Route path="add-center" element={<AddCenter />} />
            </Route>
          </Route>

          {/* E-Waste Center Panel */}
          <Route path="/center/login" element={<CenterLogin />} />
          <Route path="/center" element={<ProtectedRouteCenter isAuth={isCenterAuthenticated} />}>
            <Route element={<ECenterLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="appointments" element={<ManageAppointments />} />
              <Route path="customers" element={<Customers/>} />
              <Route path="product-master" element={<CenterProductPage/>} />
              <Route path="settings" element={<Settings/>} />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
       </UserProvider>
    </Router>
  );
}

export default AppRoutes;
