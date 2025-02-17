// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import App from './App';
// import './styles/global.scss';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <Router>
//     <Routes>
//       <Route path="/" element={<App />} />
//     </Routes>
//   </Router>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/global.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
