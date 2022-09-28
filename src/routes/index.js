import {
    Routes,
    Route
} from 'react-router-dom'; 


import Block from '@sidebar/Block';
import Section from '@sidebar/Section';
import Product from '@sidebar/Product';

import Home from '@sidebar/Home';
import CssEditor from '@sidebar/CssEditor';
import CssSimple from '@sidebar/CssSimple';
import CssManual from '@sidebar/CssManual';

const MainRoutes = () => {
    return <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/section/:handle" element={<Section/>} />
        <Route path="/block/:handle" element={<Block/>} />
        <Route path="/product/:handle" element={<Product/>} />
        <Route path="/block/css/:handle" element={<CssEditor type={'block'}/>} />
        <Route path="/section/css/:handle" element={<CssEditor type={'section'}/>} />
        <Route path="/edit_css/:type/:handle" element={<CssManual/>} />
        <Route path="/setting/:handle" element={<CssSimple type={'global'} />} />
        <Route path="/setting/detail/:handle" element={<CssEditor type={'global'} />} />
    </Routes>
}

export default MainRoutes