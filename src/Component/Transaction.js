import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataContext from '../context/DataContext';
import { MdPayment } from 'react-icons/md';
import Api from '../api/Api';

const Transaction = () => {
    const { getData,product,mainTransaction , setMainTransaction,allTransaction , setAllTransaction} = useContext(DataContext);
    const [payment, setPayment] = useState(0);
    const [name, setname] = useState("")
    const [Id, setId] = useState(0)
    const [pay , setPay] = useState(0);
    const [start_balance , setStart_balance] = useState(0);
    const [monthly_intrest , setMonthly_intrest] = useState(0);
    const [loanAmount , setLoanAmount] = useState(0);

     // intrest Calculation

     const intrest = start_balance * monthly_intrest;
     const principal = pay - intrest;
     const endBalance = start_balance - principal;

    const handlePayment = async (cusId, name , amount , monInt , emi) => {
        setPayment(1);
        setId(cusId)
        setname(name)
        setStart_balance(amount)
        setLoanAmount(amount)
        setMonthly_intrest(monInt);
        setPay(emi)

        const filtered = mainTransaction.filter((data) => data.customerId === cusId);
        if(filtered.length > 0){
            const data = {
               ...mainTransaction,
                startBalance: filtered[0].endBalance,
                principal: filtered[0].principal,
                endBalance: filtered[0].endBalance
            }
            try{
                const response = await Api.put(`/main_transaction/${cusId}` , data);
                setMainTransaction(mainTransaction.map((obj) => obj.customerId === cusId ? {...response.data} : obj));
            } catch ( err ) {
                console.log(err.message);
            }
        }
    }
    
   


    const handlePay = async () => {

        console.log("Main Transaction = " , mainTransaction)
        
        const filtered = mainTransaction.filter((data) => data.customerId === Id)
        const id = mainTransaction.length ? mainTransaction[mainTransaction.length -1].id + 1 : 1;
        const data = {
            id : id , 
            customerId : Id ,
            customerName : name,
            loanAmount : loanAmount,
            startBalance : start_balance,  
            principal : principal ,
            EMI : pay, 
            endBalance : endBalance}
            if (!filtered.length){
                try {
                    const response = await Api.post('/main_transaction' , data);
                    setMainTransaction([...mainTransaction,response.data]);
                } catch (err) {
                    console.log(err.message);
                }
            } else {
                console.log(start_balance);
            }
    }
    const handleAllTransaction = async () => {
        const id = allTransaction.length ? allTransaction[allTransaction.length -1].id + 1 : 1;
        const data = {
            id : id , 
            customerId : Id ,
            customerName : name,
            loanAmount : loanAmount,
            startBalance : start_balance,  
            principal : principal ,
            EMI : pay, 
            endBalance : endBalance}
        try {
            const response = await Api.post('/all_transaction' , data);
            if(response){
                handlePay()
            }
            setAllTransaction([...allTransaction , response.data])
            
        } catch (err) {
            console.log(err.message);
        }
        setPayment(0);
        console.log(data);
    }
    return (
        <Container>
            <Row>
                <Col>
                    <div>
                        <Link to='/'>
                            <Button>Home</Button>
                        </Link>
                    </div>
                </Col>
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                product.map((data, index) =>
                                    <tr key={data.id}>
                                        <td>{index + 1}</td>
                                        <td>{data.customerName}</td>
                                        <td>
                                            <MdPayment
                                                role='button'
                                                tabIndex='0'
                                                onClick={() => handlePayment(
                                                    data.customerId,
                                                    data.customerName,
                                                    data.PrincipleAmount,
                                                    data.monthly_intrest,
                                                    data.monthly_EMI
                                                    )}
                                            />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Col>
                {
                    payment === 1 ?
                        <div>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{name}</td>
                                        <td>
                                            <input
                                                type='number'
                                                placeholder='Enter Amount'
                                                value={pay}
                                                onChange = {(e) => setPay(e.target.value)}
                                            />
                                        </td>
                                        <td><Button onClick={() => handleAllTransaction()}>Pay</Button></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        : null
                }
            </Row>
        </Container>
    )
}

export default Transaction