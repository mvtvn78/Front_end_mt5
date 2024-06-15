import React from 'react'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import "../css/BarComponnet.css"
export default function BarComponnet({handleShowMode}) {
  return (
    <button  onClick={() => handleShowMode(true)} className='btn_showmenu text_out'>
        <FontAwesomeIcon icon={faBars}  className='icon_bars' />
    </button>
  )
}
