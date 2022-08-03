import { Routes,Route } from 'react-router-dom'; 

import SimpleContent from "@components/SimpleContent";

const PageRoutes = () => {
    return <Routes>
        <Route path="/*" element={<SimpleContent/>} />
    </Routes>
}

export default PageRoutes