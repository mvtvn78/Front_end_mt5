import React, { useContext } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { path_browser } from '../utils/constant';
import { AudioCurrentContext } from '../context/AudioCurrentContext';
export default function NotFound({content}) {
  const navigate = useNavigate();
   // use context
   const {setParamCurrent} = useContext(AudioCurrentContext);
  return (
    <Container className="it_music rounded_shape"> 
    <Row className="mt-3">
      <Col xs={12} >
            <p className="text_normal">
            {content }
            </p>
      </Col>
    <Button className='m-2'  active  onClick={ (e) => {e.preventDefault(); navigate(path_browser.HOME);  setParamCurrent('')} }>Trang chủ</Button>
    </Row>
  </Container>
  )
}
