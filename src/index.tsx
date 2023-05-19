import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import moment from "moment";
import 'moment/min/locales';


moment.locale(function getClientLocale() {
    if (typeof Intl !== 'undefined') {
        try {
            return Intl.NumberFormat().resolvedOptions().locale;
        } catch (err) {
            console.error("Cannot get locale from Intl", err)
        }
    } else {
        try {
            if (window.navigator.languages) {
                return window.navigator.languages[0];
            } else {
                return window.navigator.language;
            }
        } catch (err) {
            console.error("Cannot get locale", err)
        }
    }
}())

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

