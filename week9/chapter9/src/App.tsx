import { Provider } from 'react-redux';
import './App.css';
import CartList from './components/CartList';
import Navbar from './components/Navbar';
import store from './store/store';
import PriceBox from './components/PriceBox';
import Modal from './components/Modal';
import { useModalStore } from './hooks/useModalStore';

function AppContent() {
  const isOpen = useModalStore((state) => state.isOpen);

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