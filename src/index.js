import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
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
    store.dispatch(fetchProducts(url));
})();
 

root.render(
    <AppProvider i18n={en}>
        <Provider store={store}>
            <App />
        </Provider>
    </AppProvider>
);

reportWebVitals();