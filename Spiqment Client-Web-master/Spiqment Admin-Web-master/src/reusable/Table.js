/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { MDBDataTableV5 } from 'mdbreact'
import React from 'react'

const Table = ({ columns, rows, scrollY, nohover, noSearch }) => {
  return (
    <MDBDataTableV5
      searchTop={noSearch ? false : true}
      searchBottom={false}
      scrollX
      scrollY={scrollY ? true : false}
      hover={nohover ? false : true}
      data={{
        columns: columns,
        rows: rows,
      }}
      searching={false}
      paging={false}
      showPagination={false}
    />
  )
}

export default Table
