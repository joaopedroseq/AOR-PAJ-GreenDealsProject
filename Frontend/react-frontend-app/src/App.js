import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import Index from './pages/Index';
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    //<Routes />
    <div className="GreenDealsApp">
      <Header/>
      <Index/>
      <Footer/>
      <ToastContainer limit={3}/>
    </div>
  );
}

export default App;