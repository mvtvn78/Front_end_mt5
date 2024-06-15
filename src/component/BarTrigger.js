import React, { useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Stack from 'react-bootstrap/Stack';
import ItemQueue from '../component/ItemQueue';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import "../css/BarTrigger.css"
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {  useNavigate } from 'react-router-dom';
import {path_browser} from "../utils/constant"
import { AudioCurrentContext } from '../context/AudioCurrentContext';
import { useContext } from 'react';
export default function BarTrigger({handleShowMode,show}) {
  const [keySearch,setKeySearch]= useState('')
  // Navigate
  const navigate = useNavigate();
  const {listendList,setParamCurrent} = useContext(AudioCurrentContext);
  //Handle Press Enter
  const handlePressEnter = (e) =>{
    if(e.key =="Enter")
      {
        setKeySearch('')
        setParamCurrent(keySearch)
        handleShowMode(false)
        navigate(`/?search=${keySearch}`)
      }
  }
  return (
    <Offcanvas  show={show} onHide={() => {handleShowMode(false)}} >
        <Offcanvas.Header closeButton  style={
          {
            background:  "#635985",
          }
        }>
        </Offcanvas.Header>
        <Offcanvas.Body  className='color_bar_trigger'>
              <div id="search">
                  <Form.Control type="text" placeholder="What do you want to play" 
                  value={keySearch}
                  id="keysearch" onChange={(e)=> setKeySearch(e.target.value)}
                  onKeyDown={handlePressEnter}
                  />
                  <FontAwesomeIcon icon={faMagnifyingGlass}  id='icon_finder'/>
                </div>
              <ButtonGroup vertical className='list_func'>
                <Button className='m-2' active  onClick={ (e) => {e.preventDefault(); navigate(path_browser.HOME);  setParamCurrent('');handleShowMode(false); } }>Trang chủ</Button>
                <Button className='m-2'  onClick={ (e) => {e.preventDefault(); navigate(path_browser.ARTIST); handleShowMode(false); setParamCurrent('artist_page');}  }>My Artist</Button>
                <Button className='m-2'  onClick={ (e) => {e.preventDefault(); navigate(path_browser.PROFILE); handleShowMode(false) ; } }>My Profile</Button>
              </ButtonGroup>
              <div className="queue_container p-1">
                <Stack gap={3} className='m-2 '>
                    {listendList.map((el,idx) => <ItemQueue key={idx} info={el}/>)}
                </Stack>
              </div>
        </Offcanvas.Body>
      </Offcanvas>
  )
}
