import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import  axios from 'axios';
import App from "./App.js";
import store from '@store/index';
import { AppProvider} from "@shopify/polaris";
import reportWebVitals from './reportWebVitals';
import en from '@shopify/polaris/locales/en.json';
import "@shopify/polaris/build/esm/styles.css";
import "./index.scss";

const url = 'https://app.shopadjust-apps.com';
const root = ReactDOM.createRoot(document.getElementById("root"));

(async () => {
    const result = await axios.post(url, {
        domain: 'finaltestoftheapp.myshopify.com',
        method: 'tool'
    });
    
    store.dispatch({ type: 'INIT_DATA_FETCHED', payload: result.data });
})();
 

root.render(
    <AppProvider i18n={en}>
        <Provider store={store}>
            <App />
        </Provider>
    </AppProvider>
);

reportWebVitals();