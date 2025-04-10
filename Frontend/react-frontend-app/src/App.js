import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Components/Header/Header';
import Homepage from './Pages/Homepage/Homepage';
import Detail from './Pages/Detail/Detail';
import Footer from './Components/Footer/Footer';
import User from './Pages/User/User';
import Admin from './Pages/Admin/Admin';
import Profile from './Pages/Profile/Profile';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Utils/ProtectedRoute';
import RouteListener from './Utils/RouteListener';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from "react-intl";
import languages from "./Utils/translations";
import useLocaleStore from './Stores/useLocaleStore';
import ChatBox from './Components/ChatBox/chatBox';
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
        <ProtectedRoute>
        <Detail />
      </ProtectedRoute>
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
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }/>
      <Route path="/activate" element={
          <Activate />
      }/>
      </Routes>
      <ChatBox/>
      <Footer/>
     <ToastContainer limit={3}/>
    </div>
    </BrowserRouter>
    </IntlProvider>
  );
}

export default App;