import AppRoutes from './routes/AppRoutes.jsx'
import "admin-lte/dist/css/adminlte.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { UserProvider } from './context/UserContext.jsx';



function App() {

  return (
    <>
    
        <AppRoutes></AppRoutes>
      
    </>
  )
}

export default App
