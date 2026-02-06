import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react'
import App from './App';
import { store } from './state/store';
// import isPWA from './utils/pwa';
import './styles/main.scss';
import { worker } from './mocks/browser';

const root = ReactDOM.createRoot(document.getElementById('root'));

async function prepare() {
  if (window.APP_CONFIG.DEMO) {
    await worker.start({
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  }
}

// if (isPWA()) {
//   root.render(
//     <React.StrictMode>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <App />
//         </PersistGate>
//       </Provider>
//     </React.StrictMode>,
//   );
// } else {

prepare().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
});
// }
