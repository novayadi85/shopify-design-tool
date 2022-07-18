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

const admin_url = '/admin/apps/the-sales-suite';
const url = 'https://app.shopadjust-apps.com/packages/api';
const root = ReactDOM.createRoot(document.getElementById("root"));
let logged_in = false;
(async () => {
    let params = new URLSearchParams(window.location.search);
    
    if (params.get('store') && params.get('sourceid')) {
        let sourceid = params.get('id');
        let domain = params.get('store');
        localStorage.setItem('sa-config', {
            store: domain,
            template_id: sourceid
        });

        logged_in = true;
        store.dispatch(fetchProducts(`${url}?domain=${domain}&id=${sourceid}`));
    }
    else {
        let configs = localStorage.getItem('sa-config');
        try {
            let domain = configs.store;
            let sourceid = configs.template_id;
            logged_in = true;
            console.log('configs', configs)
            store.dispatch(fetchProducts(`${url}?domain=${domain}&id=${sourceid}`));
        } catch (error) {
            
        }
        
    }
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