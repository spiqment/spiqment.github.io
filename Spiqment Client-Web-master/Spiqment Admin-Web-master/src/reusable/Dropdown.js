/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import React, { useState } from 'react'

const Dropdown = ({ value, setValue, options, title }) => {
  const [optionName, setOptionName] = useState('')
  return (
    <CDropdown>
      <CDropdownToggle color="secondary">{!!optionName ? optionName : title}</CDropdownToggle>
      <CDropdownMenu>
        {options.map((option, index) => (
          <CDropdownItem
            key={index}
            onClick={() => {
              setValue(option.value)
              setOptionName(option.name)
            }}
          >
            {option.name}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default Dropdown
