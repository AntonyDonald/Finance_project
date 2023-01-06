import { Container } from '@mui/system'
import moment from 'moment/moment'
import React, { useContext, useState } from 'react'
import { Button, Col, Form, FormGroup, Row, Table } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Api from '../api/Api'
import DataContext from '../context/DataContext'

const Product = () => {
  const { getData, setGetData, product, setProduct,search , setSearch } = useContext(DataContext);
  const [materialName, setMaterialName] = useState("");
  const [amount, setAmount] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [selectData, setSelectData] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [monthly_intrest, setMonthly_intrest] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    // intrest calculation 
    const result = ((parseFloat(amount)) * (parseFloat(years)) * (parseFloat(rate)));
    const intrest = result / 100;
    const monthly_EMI = (parseFloat(amount) + parseFloat(intrest)) / (parseFloat(years) * 12);
    const totalAmount = (parseFloat(amount) + parseFloat(intrest));
    const monthly_int = (parseFloat(rate) / 100) / 12;

    // console.log('result = ' ,result);
    // console.log('intrest = ', intrest);
    // console.log('monthly_EMI =' ,monthly_EMI);
    // console.log('totalAmount =' ,totalAmount);
    // console.log('monthly_int = ' ,monthly_int);

    // Date 
    const today = new Date();
    const day = today.setHours(0, 0, 0, 0)
    const now = moment(new Date(day)).format('DD-MM-YYYY HH:mm:ss')

    // id 
    const id = product.length ? product[product.length - 1].id + 1 : 1;

    const data = {
      id: id,
      customerId: parseInt(customerId),
      customerName: customerName,
      Date: now,
      ProductName: materialName,
      PrincipleAmount: parseFloat(amount),
      years: parseFloat(years),
      percentage_of_intrest: parseFloat(rate),
      intrest_amount: intrest,
      total_amount: totalAmount,
      monthly_EMI: monthly_EMI,
      monthly_intrest: monthly_int,
      description: description
    }
    if (materialName.trim().length === 0){
      alert('Empty space is not allowed')
    }else{
      try {
        const response = await Api.post('/product_details', data)
        setProduct([...product, response.data])
      } catch (err) {
        console.log(err.message);
      }
      setMaterialName("");
      setCustomerName("");
      setAmount("");
      setYears("");
      setRate("");
      setDescription("");
      setSelectData(0);
    }
   
  }
  const handleClick = (id,name) => {
    setSelectData(1);
    setCustomerId(id)
    setCustomerName(name)
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
          onChange = {(e) => setSearch(e.target.value)}
          />
        </div>
        <Table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              getData.filter((val) => {
                if(search === ""){
                  return val
                } else if ((val.name).toLowerCase().includes((search).toLowerCase())){
                  return val;
                }
              }).map((obj) => 
                <tr key={obj.id}>
                  <td>{obj.id}</td>
                  <td>{obj.name}</td>
                  <td><FaPlus
                  role='button'
                  tabIndex='0'
                  onClick={()=> handleClick(obj.id , obj.name)}
                  /></td>
                </tr>
              )
            }
          </tbody>
        </Table>
        </Col>

        {/* <Col>
          <div>
            <select
              value={selectData}
              onChange={(e) => { setSelectData(e.target.value) }}
              onClick={(e) => { setCustomerId(e.target.value); setCustomerName(e.target[e.target.selectedIndex].getAttribute('data-name')) }}
            >
              <option style={{ display: 'none' }}>Select</option>
              {
                getData.map((data) =>
                  <React.Fragment key={data.id}>
                    <option data-name={data.name} value={data.id}>{data.name}</option>
                  </React.Fragment>
                )
              }
            </select>
          </div>
        </Col> */}
        {
          selectData === 1  ? 
            <div>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Form.Label>Material Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter material name'
                    required
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Form.Label>Principle Amount</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter Principle Amount'
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Form.Label>No. of Years</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter total number of years'
                    required
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Form.Label>Rate %</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter intrest'
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='if any...'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormGroup>
                <div>
                  <Button type='submit'>Submit</Button>
                  <Button onClick={() => setSelectData(0)}>Cancel</Button>
                </div>
              </Form>
            </div> : (null)
        }

        <Col>
          <div>

          </div>

        </Col>
      </Row>
    </Container>
  )
}

export default Product