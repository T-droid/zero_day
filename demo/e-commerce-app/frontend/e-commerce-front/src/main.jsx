import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { Provider } from 'react-redux';
import App from './App.jsx';
import Signup from './components/Auth/Signup.jsx';
import Login from './components/Auth/Login.jsx';
import Home from './pages/HomePage.jsx';
import './index.css'
import Orders from './pages/Orders.jsx';
import Product from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import store from './Redux/store.js';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <h2>Error 404</h2>
  },
  {
    path: "/register",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/orders",
    element: <Orders />
  },
  {
    path: "/product",
    element: <Product />
  },
  {
    path: "/cart",
    element: <CartPage />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
