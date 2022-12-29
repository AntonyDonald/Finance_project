import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataContext from '../context/DataContext';
import {CgDetailsMore} from 'react-icons/cg'

const Details = () => {
  const {getData , setGetData,product , setProduct} = useContext(DataContext);

  const [item , setItem] = useState(true);
  const [name , setName] = useState("");
  const [search , setSearch] = useState("");
  const [allValues , setAllValues] = useState([]);

  const handleDetails = (id) => {
    setItem(false);
    handleDetails1(id);
  }
  const handleDetails1 = (id) => {
    const allDetails = product.filter((data) => data.customerId === id)
    setAllValues(allDetails);
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
        {
          item === true ? (
            <Col>
            <Table>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Name</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {
                 getData.map((data,index) => 
                 <tr key={data.id}>
                  <td>{index + 1}</td>
                  <td>{data.name}</td>
                  <td>
                      <CgDetailsMore 
                        role='button'
                        tabIndex='0'
                        onClick={() => {handleDetails(data.id) ; setName(data.name)}}
                      />
                  </td>
                 </tr>
                ) 
                }
              </tbody>
            </Table>
            </Col>
          ) : (
            <Col md= {12} style = {{textAlign : 'center'}}>
              <h1>Name : &nbsp; {name}</h1>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Loan Amount</th>
                  <th>Years</th>
                  <th>% of Intrest</th>
                  <th>Intrest Amount</th>
                  <th>Total Amount</th>
                  <th>EMI (Monthly)</th>
                </tr>
              </thead>
              <tbody>
                {
                  allValues.map((data) => 
                  <tr key={data.id}>
                    <td>{data.Date}</td>
                    <td>{data.ProductName}</td>
                    <td>{data.PrincipleAmount}</td>
                    <td>{data.years}</td>
                    <td>{data.percentage_of_intrest}</td>
                    <td>{data.intrest_amount}</td>
                    <td>{data.total_amount}</td>
                    <td>{data.monthly_EMI}</td>
                  </tr>
                  )
                }
              </tbody>
            </Table>
            <Col>
            <div>
              <Button onClick={() => setItem(true)}>Back</Button>
            </div>
            </Col>
            </Col>
          
          )
        }
       
      </Row>
    </Container>
  )
}

export default Details