import {
    Routes,
    Route
} from 'react-router-dom'; 


import Block from '@sidebar/Block';
import Section from '@sidebar/Section';
import Home from '@sidebar/Home';
import CssEditor from '@sidebar/CssEditor';

const MainRoutes = () => {
    return <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/section/:handle" element={<Section/>} />
        <Route path="/block/:handle" element={<Block/>} />
        <Route path="/block/css/:handle" element={<CssEditor/>} />
        <Route path="/section/css/:handle" element={<CssEditor/>} />
    </Routes>
}

export default MainRoutes