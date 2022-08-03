import { Routes,Route } from 'react-router-dom'; 

import Login from "../pages/Login";

const PublicRoutes = () => {
    return <Routes>
        <Route path="/login" element={<Login/>} />
    </Routes>
}

export default PublicRoutes;