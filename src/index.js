import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { useParams, useLocation } from "react-router-dom";
import App from "./App.js";
import store from '@store/index';
import { AppProvider} from "@shopify/polaris";
import reportWebVitals from './reportWebVitals';
import en from '@shopify/polaris/locales/en.json';
import "@shopify/polaris/build/esm/styles.css";
import "./index.scss";
import { fetchProducts } from "@store/product/action.js";

const url = 'https://app.shopadjust-apps.com/packages/api?domain=finaltestoftheapp.myshopify.com';
const root = ReactDOM.createRoot(document.getElementById("root"));


(async () => {
    let params = new URLSearchParams(window.location.search);
    let sourceid = params.get('id')
    store.dispatch(fetchProducts(`${url}&id=${sourceid}`));
})();
 
const backup = console.warn;
console.warn = function filterWarnings(msg) {
    const supressedWarnings = ['warning text', 'other warning text', 'Deprecation'];
    if (!supressedWarnings.some(entry => msg.includes(entry))) {
        backup.apply(console, arguments);
    }
};

root.render(
    <AppProvider i18n={en}>
        <Provider store={store}>
            <App />
        </Provider>
    </AppProvider>
);

reportWebVitals();