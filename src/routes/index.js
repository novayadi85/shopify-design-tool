import {
    Routes,
    Route
} from 'react-router-dom'; 


import Block from '@sidebar/Block';
import Section from '@sidebar/Section';
import Product from '@sidebar/Product';
import ProductBlock from '@sidebar/ProductBlock'; 
import Home from '@sidebar/Home';
import CssEditor from '@sidebar/CssEditor';

const MainRoutes = () => {
    return <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/section/:handle" element={<Section/>} />
        <Route path="/block/:handle" element={<Block/>} />
        <Route path="/product/:handle" element={<Product/>} />
        <Route path="/block/css/:handle" element={<CssEditor type={'block'}/>} />
        <Route path="/section/css/:handle" element={<CssEditor type={'section'}/>} />
        <Route path="/setting/:handle" element={<CssEditor type={'global'} />} />
    </Routes>
}

export default MainRoutes