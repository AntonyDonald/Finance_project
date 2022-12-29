import { BrowserRouter as Router ,Routes , Route } from 'react-router-dom';
import Customer from './Component/Customer';
// import Demo from './Component/Demo';
import Details from './Component/Details';
import HomePage from "./Component/HomePage";
import Product from './Component/Product';
import Transaction from './Component/Transaction';
import { DataProvider } from './context/DataContext';

const App = () =>{
  return (
    <div className="App">
      <DataProvider>
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/customer' element={<Customer />} />
          <Route path='/product' element={<Product />} />
          <Route path='/details' element={<Details />} />
          <Route path='/transaction' element={<Transaction />} />
          {/* <Route path='/demo' element={<Demo />} /> */}
        </Routes>
      </DataProvider>
        
      
      
    </div>
  );
}

export default App;
