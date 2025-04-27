import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Components/Header/Header';
import Homepage from './Pages/Homepage/Homepage';
import Detail from './Pages/Detail/Detail';
import Footer from './Components/Footer/Footer';
import User from './Pages/User/User';
import Admin from './Pages/Admin/Admin';
import Profile from './Pages/Profile/Profile';
import Chat from './Pages/Chat/Chat';
import Dashboard from './Pages/Dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Utils/ProtectedRoute';
import RouteListener from './Utils/RouteListener';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from "react-intl";
import languages from "./Utils/translations";
import useLocaleStore from './Stores/useLocaleStore';
import Activate from './Pages/Activate/Activate';

function App() {
  const locale = useLocaleStore((state) => state.locale);
  
  return (
    <IntlProvider locale={locale} messages={languages[locale]}>

    <BrowserRouter>
    <RouteListener />
    <div className="GreenDealsApp">
      <Header/>
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/detail" element={
        <Detail locale={locale}/>
      }/>
      <Route path="/user" element={
        <ProtectedRoute>
          <User />
        </ProtectedRoute>
      }/>
      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      }/>
      <Route path="/profile" element={
          <Profile />
      }/>
      <Route path="/chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }/>
      <Route path="/activate" element={
          <Activate />
      }/>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }/>
      </Routes>
      <Footer/>
     <ToastContainer limit={3}/>
    </div>
    </BrowserRouter>
    </IntlProvider>
  );
}

export default App;