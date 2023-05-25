/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { CPagination, CPaginationItem } from '@coreui/react'
import React from 'react'
import { PAGE_RECORDS_LIMIT } from 'src/constants/generalConstants'

const Pagination = ({ count, page, setPage }) => {
  return (
    <CPagination align="center" aria-label="Page navigation example">
      <CPaginationItem
        disabled={count < PAGE_RECORDS_LIMIT || page <= 1}
        onClick={() => page > 1 && setPage((prevVal) => prevVal - 1)}
        aria-label="Previous"
      >
        <span aria-hidden="true">&laquo;</span>
      </CPaginationItem>
      {count > PAGE_RECORDS_LIMIT &&
        [...Array.from({ length: Math.ceil(count / PAGE_RECORDS_LIMIT) }, (v, i) => i + 1)].map(
          (val) => (
            <CPaginationItem onClick={() => setPage(val)} key={val}>
              {val}
            </CPaginationItem>
          ),
        )}
      <CPaginationItem
        disabled={count < PAGE_RECORDS_LIMIT || page === Math.ceil(count / PAGE_RECORDS_LIMIT)}
        onClick={() => page < count / PAGE_RECORDS_LIMIT && setPage((prevVal) => prevVal + 1)}
        aria-label="Next"
      >
        <span aria-hidden="true">&raquo;</span>
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
