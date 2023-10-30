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
import { ErrorPage, HomePage, LoginPage, NotFoundPage, SignUpPage } from './pages';
import { SingletonLayout } from './layout';
import { SecuredComponents, UnSecuredComponents } from './components';

const router = createBrowserRouter([
  {
    path: "auth",
    element: <SingletonLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: (
          <UnSecuredComponents>
            <LoginPage />
          </UnSecuredComponents>
        ),
        errorElement: <ErrorPage />,
        index: true,
      },
      {
        path: "signup",
        element: (
          <UnSecuredComponents>
            <SignUpPage />
          </UnSecuredComponents>
        ),
        errorElement: <ErrorPage />,
        index: true,
      },
    ]
  },
  {
    path: "/",
    element: <SingletonLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: (
          <SecuredComponents>
            <HomePage />
          </SecuredComponents>
        ),
        errorElement: <ErrorPage />,
        index: true,
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
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
