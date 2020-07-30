import React from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'

function Table(props) {
    const entries = props.entries || [];
    console.log(entries)

    const columns = React.useMemo(
        () => [
            {
                Header: 'Status',
                accessor: 'status'
            },
            {
                Header: 'Method',
                accessor: 'method'
            },
            {
                Header: 'Size',
                accessor: 'size'
            },
            {
                Header: 'Time',
                accessor: 'time'
            },
            {
                Header: 'URL',
                accessor: 'url'
            }
        ],
        []
    );
    
    let dataForMemo = [];

    if (entries.length !== 0) {
        entries.forEach(
            (entry) => {
                const status = entry[`response`][`status`];
                const method = entry[`request`][`method`];
                const url = entry[`request`][`url`];
                const size = entry[`response`][`bodySize`];
                const time = entry[`time`];

                dataForMemo.push(
                    {
                        status: `${status}`,
                        method: `${method}`,
                        size: `${size}`,
                        time: `${time}`,
                        url: `${url}`
                    }
                )
            }
        );
    }

    const data = dataForMemo;

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data })

    if (entries.length === 0) {
        return (
            <Root>
                <h2>
                    Please load a HAR file to view the table.
                </h2>
            </Root>
        );
    }

    return (
        <Root>
            <TableStyle {...getTableProps()} style={{}}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableHeader {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </TableHeader>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(
                            (row) => {
                                prepareRow(row);
                                
                                return (
                                    <tr {... row.getRowProps()}>
                                        {
                                            row.cells.map(
                                                (cell) => {
                                                    return (
                                                        <TableData {... cell.getCellProps()}>
                                                            {cell.render('Cell')}
                                                        </TableData>
                                                    )
                                                }
                                            )
                                        }
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </TableStyle>
        </Root>
    );
}

const Root = styled.section`
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    h2 {
        text-align: center;
    }
`

const TableStyle = styled.table`
    border: 1px solid blue;
`

const TableHeader = styled.th`
    background: aliceblue;
    color: black;
    font-weight: bold;
`

const TableData = styled.td`
    padding: 5px;
    border-bottom: 1px solid rgba(1, 1, 1, 0.1);
`

export default Table;