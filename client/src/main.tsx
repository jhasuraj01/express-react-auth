import { App, ConfigProvider, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './app/store';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorPage, HomePage, LoginPage, SignUpPage } from './pages';
import { SingletonLayout } from './layout';

const router = createBrowserRouter([
  {
    path: "auth",
    element: <SingletonLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
        index: true,
      },
      {
        path: "signup",
        element: <SignUpPage />,
        errorElement: <ErrorPage />,
        index: true,
      },
    ]
  },
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
    index: true,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm
        }}
      >
        <App>
          <RouterProvider router={router} />
        </App>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
)
