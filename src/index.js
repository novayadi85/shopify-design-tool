import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import App from "./App.js";
import store from '@store/index';
import { AppProvider} from "@shopify/polaris";
import reportWebVitals from './reportWebVitals';
import en from '@shopify/polaris/locales/en.json';
import "@shopify/polaris/build/esm/styles.css";
import "./index.scss";
import { ThemeContent } from "./Context.js";
import { fetchProducts } from "@store/product/action.js";
const url =  process.env.NODE_ENV === "development" ? process.env.REACT_APP_REST_URL : 'https://app.dev.shopadjust-apps.com/packages/api' ; 
const root = ReactDOM.createRoot(document.getElementById("root"));

let loaded = false;

(async () => {
    let params = new URLSearchParams(window.location.search);
    // Display the key/value pairs
    const skipParams = ['store', 'id'];
    if (params.get('host')) {
        let urlParams = '';
        for (const [key, value] of params.entries()) {
            if (!skipParams.includes(key)) {
                urlParams += `${key}=${value}`
            }
        }
    
        localStorage.setItem('sa-urlparams', urlParams);
    }

    if (params.get('prev')) {
        localStorage.setItem('sa-prev-url', params.get('prev'));
        localStorage.setItem('sa-products', JSON.stringify({}));
    }

    if (params.get('store') && params.get('id')) {
        let sourceid = params.get('id');
        let domain = params.get('store');
        localStorage.setItem('sa-config', JSON.stringify({
            store: domain,
            template_id: sourceid
        }));

        store.dispatch(fetchProducts(`${url}?domain=${domain}&id=${sourceid}`));
    }
    else {
        let configs = localStorage.getItem('sa-config');
        try {
            configs = JSON.parse(configs)
            let domain = configs.store;
            let sourceid = configs.template_id;

            store.dispatch(fetchProducts(`${url}?domain=${domain}&id=${sourceid}`));
        } catch (error) {
            
        }
    }

    const message = JSON.stringify({
        message: 'Ready',
    });
    
    window.parent.postMessage(message, '*');

})();
 
const backup = console.warn;
console.warn = function filterWarnings(msg) {
    const supressedWarnings = ['warning text', 'other warning text', 'Deprecation'];
    if (!supressedWarnings.some(entry => msg.includes(entry))) {
        backup.apply(console, arguments);
    }
};


const Main = () => {
    const [context, setContext] = useState({
		ready: true
    });
    
    return (
        <ThemeContent.Provider value={[context, setContext]}>
            <Provider store={store}>
                <App />
            </Provider>
        </ThemeContent.Provider>
    )
}

root.render(
    <AppProvider i18n={en}> 
        <Main/>
    </AppProvider>
);

reportWebVitals();