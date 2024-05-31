import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromChildren } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Redirect from './pages/Redirect.jsx'

const router=createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App/>}>
     <Route path="" element={<Home/>}/>
     <Route path="login" element={<Login/>}/>
     <Route path="signup" element={<Signup/>}/>
     <Route path="/:id" element={<Redirect/>}/>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}>
    <App />
    </RouterProvider>
    </Provider>
)
