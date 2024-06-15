import React, { useEffect, useRef, useState } from 'react'
import { Container,Row,Col, ButtonGroup, Button } from 'react-bootstrap'
import { logo } from '../images/ImageManager'
import "../css/SignPage.css"
import SignInComponnet from '../component/SignInComponnet'
import SignUpComponnet from '../component/SignUpComponnet'
// Cookies
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from '../services/customize_axios'
//component
import Alert from "../component/Alert";
export default function SignPage() {
    //
    const [alertShow, setAlertShow] = useState(false);
    const navigate = useNavigate();
    const [pagemode,setPageMode]= useState(0)
    let content_alert = useRef({content :'',status:''})
    const [cookies, setCookie] = useCookies(['access_token'])
    const handleBtnChange =(index) => {
        //Check current pagemode
        if(pagemode !== index)
            setPageMode(index);
    }
    // handle cookie
    const handleCookie =  async(token) => {
        const value = await axios.get(`/users?token=${token}`)
        if(+value.ErrorCode ===0)
            navigate("/")
        return;
    }
    //Check cookie
    useEffect(()=>{
        const access_cookies = cookies.access_token
        // can get cookies
        if(access_cookies)
        {
            handleCookie(access_cookies)
        }
    },[])
    return (
        <Container className='sign_container '>
            <Row > 
                <Col xs ={12} className='p-2' >
                    <div className="logo_container">
                        <img src={logo} alt="" className="logo" />
                    </div>
                </Col>
                <Col xs={{span:12 }} className='my-3 p-2'>
                   <div className="btn_container ">
                    <ButtonGroup  className='btn_sign '>
                            <Button  variant="outline-primary" active={  (pagemode==0)  ? true: false}  
                            onClick={ () => { handleBtnChange(0); }}
                            >Đăng nhập</Button>
                            <Button variant="outline-primary" active={  (pagemode==1)  ? true: false} 
                            onClick={ () => { handleBtnChange(1)}}
                            >Đăng ký</Button>
                    </ButtonGroup>
                   </div>
                </Col>
                <Col xs={12}>
                    <div className="form_container">
                    {(pagemode==0) ? <SignInComponnet content={content_alert.current}  setAlertShow={setAlertShow} /> : <SignUpComponnet content={content_alert.current}  setAlertShow={setAlertShow}   />}
                    </div>
                </Col>
        </Row>
        <Alert show = {alertShow} onHide= {()=> setAlertShow(false)}
            content = {content_alert.current.content}
            status = {content_alert.current.status}    
        />
        </Container>
    )
}
