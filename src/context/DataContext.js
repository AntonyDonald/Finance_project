import { createContext, useEffect, useState } from "react";
import Api from "../api/Api";


const DataContext = createContext();

export const DataProvider  = ({children}) => {

     const [getData , setGetData] = useState([]);
     const [product , setProduct] = useState([]);
     const [mainTransaction , setMainTransaction] = useState([]);
     const [allTransaction , setAllTransaction] = useState([]);

     useEffect(() => {
        const fetchdata1 = async () => {
            try{
                const response = await Api.get('/customer')
                setGetData(response.data)
            } catch ( err ) {
                console.log(err.message)
            }
            
        }
        fetchdata1();

        const fetchData2 = async() => {
            try{
                const response = await Api.get('/product_details')
                setProduct(response.data)
            } catch ( err) {
                console.log(err.message)
            }
        }
        fetchData2();

        const fetchData3 = async () => {
            try{
                const response = await Api.get("/main_transaction");
                setMainTransaction(response.data);
            } catch ( err ) {
                console.log(err.message)
            }
        }
        fetchData3();

        const fetchData4 = async () => {
            try {
                const response = await Api.get('/all_transaction');
                setAllTransaction(response.data)
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchData4();
     },[])
    return(
        <DataContext.Provider value ={{
            getData , setGetData,product , setProduct,mainTransaction , 
            setMainTransaction,allTransaction , setAllTransaction
        }}>{children}</DataContext.Provider>
    )
}

export default DataContext;