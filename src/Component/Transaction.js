import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataContext from '../context/DataContext';
import { MdPayment, MdPayments } from 'react-icons/md';
import Api from '../api/Api';

const Transaction = () => {
    const { getData, product, mainTransaction, setMainTransaction, allTransaction, setAllTransaction, search, setSearch } = useContext(DataContext);
    const [payment, setPayment] = useState(0);
    const [name, setname] = useState("")
    const [CuId, setCuId] = useState(0)
    const [Id, setId] = useState(0)
    const [payEmi, setPayEmi] = useState(0);
    const [payPrincipal, setPayPrincipal] = useState(0);
    const [start_balance, setStart_balance] = useState(0);
    const [monthly_intrest, setMonthly_intrest] = useState(0);
    const [loanAmount, setLoanAmount] = useState(0);

    const handlePayment = async (id, cusId, name, amount, monInt, emi) => {
        setPayment(1);
        setId(id)
        setCuId(cusId)
        setname(name)
        setStart_balance(amount)
        setLoanAmount(amount)
        setMonthly_intrest(monInt);
        setPayEmi(emi)

        const filtered = mainTransaction.filter((data) => data.id === id);
        if (filtered.length > 0) {
            const data = {
                id: id,
                customerId: cusId,
                customerName: name,
                loanAmount: amount,
                startBalance: filtered[0].endBalance,
                principal: filtered[0].principal,
                EMI: emi,
                endBalance: filtered[0].endBalance
            }
            try {
                const response = await Api.put(`/main_transaction/${id}`, data);
                setMainTransaction(mainTransaction.map((obj) => obj.id === id ? { ...response.data } : obj));
            } catch (err) {
                console.log(err.message);
            }
        }
    }

    // auto call from handleAllTransaction

    const handlePay = async () => {

        // main intrest Calculation

        const intrest = start_balance * monthly_intrest;
        const principal = payEmi - intrest;
        const endBalance = start_balance - principal;

        const filtered = mainTransaction.filter((data) => data.id === Id)
        const data = {
            id: Id,
            customerId: CuId,
            customerName: name,
            loanAmount: loanAmount,
            startBalance: start_balance,
            principal: principal,
            EMI: payEmi,
            endBalance: endBalance
        }
        if (!filtered.length) {
            try {
                const response = await Api.post('/main_transaction', data);
                setMainTransaction([...mainTransaction, response.data]);
            } catch (err) {
                console.log(err.message);
            }
        } else {
            const filtered = mainTransaction.filter((data) => data.id === Id);
            // intrest Calculation for monthly transaction

            const intrest = filtered[0].startBalance * monthly_intrest;
            const principal = payEmi - intrest;
            const endBalance = filtered[0].startBalance - principal;
            const data = {
                id: Id,
                customerId: CuId,
                customerName: name,
                loanAmount: loanAmount,
                startBalance: filtered[0].startBalance,
                principal: principal,
                EMI: payEmi,
                endBalance: endBalance
            }
            const data1 = {
                customerId: CuId,
                customerName: name,
                loanAmount: loanAmount,
                startBalance: filtered[0].startBalance,
                principal: principal,
                EMI: payEmi,
                endBalance: endBalance
            }

            try {
                const response = await Api.put(`/main_transaction/${Id}`, data);
                setMainTransaction(mainTransaction.map((obj) => obj.id === Id ? { ...response.data } : obj));
                const response1 = await Api.post('/all_transaction', data1)
                setAllTransaction([...allTransaction, response1.data])
            } catch (err) {
                console.log(err.message);
            }
        }
    }

    // for pay monthly EMI
    const handleAllTransaction = async () => {
        const filtered = allTransaction.filter((data) => data.customerId === CuId)

        // main intrest Calculation
        const intrest = start_balance * monthly_intrest;
        const principal = payEmi - intrest;
        const endBalance = start_balance - principal;

        const id = allTransaction.length ? allTransaction[allTransaction.length - 1].id + 1 : 1;
        const data = {
            id: id,
            customerId: CuId,
            customerName: name,
            loanAmount: loanAmount,
            startBalance: start_balance,
            principal: principal,
            EMI: payEmi,
            endBalance: endBalance
        }
        // first time post only
        if (filtered.length === 0) {
            try {
                const response = await Api.post('/all_transaction', data);
                setAllTransaction([...allTransaction, response.data])
            } catch (err) {
                console.log(err.message);
            }
        }
        handlePay();
        setPayment(0);
        setId(0)
        setCuId(0)
        setname('')
        setStart_balance(0)
        setLoanAmount(0)
        setMonthly_intrest(0);
        setPayEmi(0)
    }
    // pay principal Amount

    const handlePrincipal = (id, cusId, name, amount, monInt, emi) => {
        setPayment(2);
        setId(id)
        setCuId(cusId)
        setname(name)
        setStart_balance(amount)
        setLoanAmount(amount)
        setMonthly_intrest(monInt);
        setPayEmi(emi)
    }

    const handlePayPrincipal = async () => {

        const filtered = mainTransaction.filter((data) => data.id === Id);

        if(filtered.length > 0){
            const payAmount = parseFloat(filtered[0].endBalance) - parseFloat(payPrincipal)

            const intrest = payAmount * monthly_intrest;
            const principal = payEmi - intrest;
            const data = {
                id: Id,
                customerId: CuId,
                customerName: name,
                loanAmount: loanAmount,
                startBalance: payAmount,
                principal: principal,
                EMI: payEmi,
                endBalance: payAmount
            }
            try {
                const response = await Api.put(`main_transaction/${Id}` , data)
                setMainTransaction(mainTransaction.map((obj) => obj.id === Id ? {...response.data} : obj))
            } catch (err) {
                console.log(err.message);
            }
        } else {
        const balance = loanAmount - payPrincipal   
        const intrest = balance * monthly_intrest;
        const principal = payEmi - intrest;
        // const endBalance = balance - principal;
            const data = {
                id: Id,
                customerId: CuId,
                customerName: name,
                loanAmount: loanAmount,
                startBalance: balance,
                principal: principal,
                EMI: payEmi,
                endBalance: balance
            }
            try{
                const response = await Api.post('/main_transaction' , data)
                setMainTransaction([...mainTransaction , response.data])
                const response1 = await Api.post('/all_transaction' , data)
                setAllTransaction([...allTransaction , response1.data])
            } catch(err){
                console.log(err.message);
            }
        }
       
       
        
        setPayment(0);
        setId(0)
        setCuId(0)
        setname('')
        setStart_balance(0)
        setLoanAmount(0)
        setMonthly_intrest(0);
        setPayEmi(0)
        setPayPrincipal(0);
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
                    <div>
                        <Form.Control
                            type='text'
                            placeholder='Search...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Material</th>
                                <th>Pay EMI</th>
                                <th>Pay Principal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                product.filter((val) => {
                                    if (search === "") {
                                        return val;
                                    } else if (val.customerName.toLowerCase().includes(search.toLowerCase())) {
                                        return val;
                                    }
                                }).map((data, index) =>
                                    <tr key={data.id}>
                                        <td>{index + 1}</td>
                                        <td>{data.customerName}</td>
                                        <td>{data.ProductName}</td>
                                        <td>
                                            <MdPayment
                                                role='button'
                                                tabIndex='0'
                                                onClick={() => handlePayment(
                                                    data.id,
                                                    data.customerId,
                                                    data.customerName,
                                                    data.PrincipleAmount,
                                                    data.monthly_intrest,
                                                    data.monthly_EMI
                                                )}
                                            />
                                        </td>
                                        <td>
                                            <MdPayments
                                                role='button'
                                                tabIndex='0'
                                                onClick={() => handlePrincipal(
                                                    data.id,
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
                                                value={payEmi}
                                                onChange={(e) => setPayEmi(e.target.value)}
                                                readOnly
                                            />
                                        </td>
                                        <td><Button onClick={() => handleAllTransaction()}>Pay EMI</Button></td>
                                        <td><Button onClick={() => setPayment(0)}>Cancel</Button></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        : null
                }
                {
                    payment === 2 ?
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
                                                placeholder='Enter Principal Amount'
                                                value={payPrincipal}
                                                onChange={(e) => setPayPrincipal(e.target.value)}
                                            />
                                        </td>
                                        <td><Button onClick={() => handlePayPrincipal()}>Pay Principal</Button></td>
                                        <td><Button onClick={() => setPayment(0)}>Cancel</Button></td>
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