import React, { useState } from 'react'
import { pink } from '@mui/material/colors'
import Checkbox from '@mui/material/Checkbox'
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

export default function ColorCheckboxes() {
  const [colorArr, setColorArr] = useState(['blue'])

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    var x = document.getElementById('Colors-Selected')
    x.style.display = 'none'
    localStorage.removeItem('color')
    console.log(`${name} is ${checked}`)
    if (checked === true) {
      setColorArr([...colorArr, value])
    } else {
      setColorArr(colorArr.filter((e) => e !== value))
    }
  }

  const printArr = () => {
    console.log(colorArr)
    var x = document.getElementById('Colors-Selected')
    x.style.display = 'inline-block'
    localStorage.setItem('color', colorArr)
  }

  return (
    <div>
      <Checkbox {...label} name="blue" value="blue" defaultChecked onClick={handleChange} />
      <Checkbox {...label} name="purple" color="secondary" value="purple" onClick={handleChange} />
      <Checkbox {...label} name="green" color="success" value="green" onClick={handleChange} />
      <Checkbox {...label} name="black" color="default" value="black" onClick={handleChange} />
      <Checkbox
        {...label}
        name="pink"
        value="pink"
        onClick={handleChange}
        sx={{
          color: pink[800],
          '&.Mui-checked': {
            color: pink[600],
          },
        }}
      />
      <button onClick={printArr} type="button">
        Done
      </button>
      <DoneTwoToneIcon id="Colors-Selected" style={{ display: 'none', color: 'green' }} />
    </div>
  )
}
