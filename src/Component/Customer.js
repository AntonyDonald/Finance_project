import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form, FormGroup, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Api from '../api/Api';
import DataContext from '../context/DataContext';
import {FaEdit , FaTrashAlt} from 'react-icons/fa'

const Customer = () => {
    const { getData , setGetData} = useContext(DataContext);
    const [details, setDetails] = useState({});
    const [editId , setEditId] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails({
            ...details,
            [name]: value
        })
    }
    const handleSubmit = async  (e) => {
        e.preventDefault();
        const data = {
            name : details.name ,
            gender : details.gender ,
            age : details.age ,
            phone : details.phone ,
            address : details.address            
        }
        if(editId === 0) {
            try {
                const response  = await Api.post('/customer' , data)
                setGetData([...getData , response.data])
           } catch ( err ) {
            console.log(err.message)
           }
        } else {
           try{
                const response = await Api.put(`/customer/${editId}`, data);
                setGetData(getData.map((data) => data.id === editId ? {...response.data} : data))
           } catch ( err ) {
            console.log(err.message)
           }
        }
      
       setDetails({})
    }
    const handleEdit = (id , data) => {
        setEditId(id)
        setDetails(data)
    }
    const handleDelete = async (id) => {
       const filtered = getData.filter((data) => data.id !== id)
       setGetData(filtered)
       await Api.delete(`/customer/${id}`)

    }
    
    return (
        <Container>
            <Row>
                <div>
                    <Link to='/'>
                        <Button>Home</Button>
                    </Link>
                </div>
                <div className="row">
                    <div className="col">
                    
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    required
                                    type='text'
                                    placeholder='Enter name'
                                    name='name'
                                    value={details.name || ""}
                                    onChange={(e) => handleChange(e)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Form.Label>Gender</Form.Label>
                                <RadioGroup
                                    
                                    row
                                    name='gender'
                                    value={details.gender || ""}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <FormControlLabel value='male' label='Male' control={<Radio  required/>} />
                                    <FormControlLabel value='female' label='Female' control={<Radio required/>} />
                                    <FormControlLabel value='others' label='Others' control={<Radio required/>} />
                                </RadioGroup>
                            </FormGroup>
                            <FormGroup>
                                <Form.Label>Age</Form.Label>
                                <Form.Control
                                    required
                                    type='text'
                                    placeholder='Enter age'
                                    name='age'
                                    value={details.age || ""}
                                    onChange={(e) => handleChange(e)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    required
                                    type='text'
                                    placeholder='Enter phone Number'
                                    name='phone'
                                    value={details.phone || ""}
                                    onChange={(e) => handleChange(e)}

                                />
                            </FormGroup>
                            <FormGroup>
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    required
                                    type='text'
                                    placeholder='Enter address'
                                    name='address'
                                    value={details.address || ""}
                                    onChange={(e) => handleChange(e)}
                                />
                            </FormGroup>
                            <div>
                                <Button type='submit'>Submit</Button>
                            </div>
                        </Form>
                    </div>
                    <div className="col">
                       
                        <Table>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    getData.map((data ,index) => 
                                    <tr key={data.id}>
                                        <td>{index + 1}</td>
                                        <td>{data.name}</td>
                                        <td>{data.gender}</td>
                                        <td>{data.age}</td>
                                        <td>{data.phone}</td>
                                        <td>{data.address}</td>
                                        <td>
                                            <FaEdit
                                            role='button'
                                            tabIndex='0'
                                            onClick={() => handleEdit( data.id , data)}
                                            />
                                            <FaTrashAlt
                                            role='button'
                                            tabIndex='0'
                                            onClick={() => handleDelete(data.id)}
                                            />
                                        </td>
                                    </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                        
                    </div>
                
                    
                </div>
            </Row>
        </Container>
    )
}

export default Customer