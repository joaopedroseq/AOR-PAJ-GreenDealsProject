import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import Homepage from './pages/Homepage/Homepage';
import Detail from './pages/Detail/Detail';
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Utils/ProtectedRoute';


function App() {
  /*const fetchCategories = categoriesStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories(); // Fetch categories when the app initializes
  }, [fetchCategories]);*/
  return (
    

    <BrowserRouter>
    <div className="GreenDealsApp">
      <Header/>
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/detail" element={
        <ProtectedRoute>
        <Detail />
      </ProtectedRoute>
      }/>
      {/*<Route path="/user" element={<UserPage />} />*/}
      </Routes>
      <Footer/>
     <ToastContainer limit={3}/>
    </div>
    </BrowserRouter>
  );
}

export default App;