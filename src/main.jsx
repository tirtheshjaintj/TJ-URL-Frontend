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
import AuthBox from './components/AuthBox.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google"

const router=createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App/>}>
     <Route path="" element={<AuthBox><Home/></AuthBox>}/>
     <Route path="login" element={<Login/>}/>
     <Route path="signup" element={<Signup/>}/>
     <Route path="/:id" element={<Redirect/>}/>
     <Route path="url/:id" element={<AuthBox><Dashboard/></AuthBox>}/>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
  <Provider store={store}>
    <RouterProvider router={router}>
    <App />
    </RouterProvider>
    </Provider>
  </GoogleOAuthProvider>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('serviceWorker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}