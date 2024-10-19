import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
           

            {/* <LoginPage/> */}
            {/* <RegisterPage/> */}

            {/* <ProfilePage/> */}
            <div className="content-wrapper"  style={{ marginTop: '56px',marginBottom:'56px' }}>
                <div className="content">
                    <div className="container-fluid">
                        {/* Your main content goes here */}
                        {/* <DataTable/> */}
                        <Outlet/>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default AdminLayout;