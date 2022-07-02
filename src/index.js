import React from "react";
import ReactDOM from 'react-dom';
import App from "./App.js";
import { AppProvider } from "@shopify/polaris";
import reportWebVitals from './reportWebVitals';
import en from '@shopify/polaris/locales/en.json';
import "@shopify/polaris/build/esm/styles.css";
import "./index.scss";
const app = <AppProvider i18n={en}><App /></AppProvider>;

ReactDOM.render(app, document.getElementById("root"));

reportWebVitals();