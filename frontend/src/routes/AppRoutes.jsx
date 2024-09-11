import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageCenters from '../pages/Admin/ManageCenters';

import UserHome from '../pages/User/Home';
import Articles from '../pages/User/Articles';
import BookAppointment from '../pages/User/BookAppointment';

import ECenterDashboard from '../pages/center/Dashboard';
import ManageAppointments from '../pages/center/ManageAppointments';
import HeaderFooter from '../pages/user/HeaderFooter';

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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-centers" element={<ManageCenters />} />
        
        {/* E-Waste Center Panel */}
        <Route path="/center/dashboard" element={<ECenterDashboard />} />
        <Route path="/center/manage-appointments" element={<ManageAppointments />} />

        {/* 404 rote */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
export default AppRoutes;
