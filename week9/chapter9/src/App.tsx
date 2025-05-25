import { Provider } from 'react-redux';
import './App.css';
import CartList from './components/CartList';
import Navbar from './components/Navbar';
import store from './store/store';
import PriceBox from './components/PriceBox';
import Modal from './components/Modal';
import { useAppSelector } from './hooks/useCustomRedux';

function AppContent() {
  const isOpen = useAppSelector((state) => state.modal.isOpen);

  return (
    <>
      <Navbar />
      <CartList />
      <PriceBox />
      {isOpen && <Modal />} {}
    </>
  );
}


function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App;