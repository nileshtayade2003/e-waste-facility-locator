import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminLayout from '../components/admin/AdminLayout';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageCenters from '../pages/Admin/ManageCenters';
import AddCenter from '../pages/admin/AddCenter';

import UserHome from '../pages/User/Home';
import Articles from '../pages/User/Articles';
import BookAppointment from '../pages/User/BookAppointment';

import CenterLogin from '../pages/center/CenterLogin'
import ECenterDashboard from '../pages/center/Dashboard';
import ManageAppointments from '../pages/center/ManageAppointments';
import HeaderFooter from '../pages/user/HeaderFooter';
import NotFoundPage from '../components/NotFoundPage';
import ECenterLayout from '../components/e-center/ECenterLayout';


function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* User Panel */}
        <Route path="/" element={<HeaderFooter />} >
          <Route  index element={<UserHome />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/articles" element={<Articles />} />
        </Route>
        
        
        {/* Admin Panel */}
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/admin' element={<AdminLayout/>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-centers" element={<ManageCenters />} />
          <Route path="/admin/add-center" element={<AddCenter />} />
        </Route>
        
        {/* E-Waste Center Panel */}
        <Route path='/center/login' element={<CenterLogin/>} />
        <Route path='/center' element={<ECenterLayout/>} >
          <Route path="/center" element={<ECenterDashboard />} />
          <Route path="/center/manage-appointments" element={<ManageAppointments />} />   
        </Route>

        {/* 404 rote */}
        {/* <Route path='*' element={<HeaderFooter/>}>
        </Route> */}
          <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Router>
  );
}
export default AppRoutes;
