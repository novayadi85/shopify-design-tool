import {
    Routes,
    Route
} from 'react-router-dom'; 


import Block from '@sidebar/Block';
import Section from '@sidebar/Section';
import Product from '@sidebar/Product';
import ProductBlock from '@sidebar/ProductBlock'; 
import CssEditor from '@sidebar/CssEditor';
import ProtectedRoute from '@components/ProtectedRoute';
import Login from '@components/Login';
import Layout from '@components/Layout';
                
const MainRoutes = () => {
    return <Routes>
        <Route exact path='/' element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
                <Route path="/section/:handle" element={<Section/>} />
                <Route path="/block/:handle" element={<Block/>} />
                <Route path="/product/:handle" element={<Product/>} />
                <Route path="/block/css/:handle" element={<CssEditor type={'block'}/>} />
                <Route path="/section/css/:handle" element={<CssEditor type={'section'}/>} />
                <Route path="/offer-setting" element={<CssEditor type={'global'} />} />
            </Route>
        </Route>
        <Route path="/login" element={<Login />} />
    </Routes>
}

export default MainRoutes