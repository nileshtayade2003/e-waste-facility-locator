import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const ECenterLayout = () => {
    return (
        <div className="wrapper">
            <Navbar/>
            <Sidebar />

            {/* <LoginPage/> */}
            {/* <RegisterPage/> */}

            {/* <ProfilePage/> */}
            <div className="content-wrapper">
                <div className="content">
                    <div className="container-fluid">
                        <h1>Welcome to Center Dashboard</h1>
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

export default ECenterLayout;