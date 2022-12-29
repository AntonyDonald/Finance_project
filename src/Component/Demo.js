import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import Api from '../api/Api';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Button } from 'react-bootstrap';
const Demo = () => {
    const [getData, setGetData] = useState([]);
    const { ExportCSVButton } = CSVExport;

    const MyExportCSV = (props) => {
        const handleClick = () => {
            props.onExport();
        }
        return (
            <div>
                <Button onClick={handleClick}>Export to CSV</Button>
            </div>
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Api.get('/customer')
                setGetData(response.data)
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchData()
    }, []);

    const columns = [
        { dataField: 'id', text: 'Id' },
        { dataField: 'name', text: 'Name', sort: true, filter: textFilter() },
        { dataField: 'age', text: 'Age' },
        { dataField: 'gender', text: 'Gender' },
        { dataField: 'phone', text: 'Phone' },
        { dataField: 'address', text: 'Address' }
    ]
    const pagination = paginationFactory({
        page: 1,
        sizePerPage: 2,
        lastPageText: '>>',
        firstPageText: '<<',
        nextPageText: '>',
        prePageText: '<',
        showTotal: true,
        alwaysShowAllBtns: true,

    })
    return (
        <>
            <ToolkitProvider
                keyField='id'
                columns={columns}
                data={getData}
                bootstrap4
            >
                {
                    props => (
                        <React.Fragment>
                            <MyExportCSV {...props.csvProps} />

                            <BootstrapTable
                                // keyField='id'
                                // columns={columns}
                                // data = {getData }
                                // bootstrap4
                                pagination={pagination}
                                filter={filterFactory()}
                                {...props.baseProps}
                            />
                        </React.Fragment>


                    )
                }
            </ToolkitProvider>
        </>
    )
}

export default Demo