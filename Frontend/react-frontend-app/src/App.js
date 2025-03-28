import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import Homepage from './pages/Homepage/Homepage';
import Detail from './pages/Detail/Detail';
import Footer from './components/Footer/Footer';
import User from './pages/User/User';
import Admin from './pages/Admin/Admin';
import Profile from './pages/Profile/Profile';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Utils/ProtectedRoute';
import RouteListener from './Utils/RouteListener';


function App() {
  
  return (
    

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
      </Routes>
      <Footer/>
     <ToastContainer limit={3}/>
    </div>
    </BrowserRouter>
  );
}

export default App;