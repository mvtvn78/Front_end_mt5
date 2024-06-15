import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
//Redirect
import { useNavigate } from 'react-router-dom';
// Cookies
import { useCookies } from 'react-cookie'
//Axios
import axios from "axios";
import { URL_backend } from "../utils/constant";
export default function SignInComponnet({content,setAlertShow}) {
  const navigate = useNavigate();
  const [modeForgot, setModeForgot] = useState(false);
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const [cookies, setCookie] = useCookies(['access_token'])
  const [show,setShow]= useState(false)
  const handleEmailInput = (e) => {
    setEmail(e.target.value)
  }
  const handlePassInput = (e) => {
    setPass(e.target.value)
  }
  const handleForgotButon = (e) =>{
    axios.post(URL_backend+"/api/v1/forgot",
      {
        email
      }
    ).then(
      res => {
        if(res.data && + res.data.ErrorCode ===0)
          {
            content.content = <p>Đã gửi thành công vui lòng check email</p>
            content.status = "sucess"
            setAlertShow(true)
            return;
          }
        if(+res.data.ErrorCode === -2)
          {
            content.content = <p>Email không tồn tại hoặc không hợp lệ</p>
            content.status = "warning"
            setAlertShow(true)
            return;
          }
          content.content = <p>Lỗi không xác định</p>
          content.status = "warning"
          setAlertShow(true)
      }
    )
  }
  const handleOnSubmit = (e) => {
    if(!email || !pass)
      {
        content.content = <p>Vui lòng điền đẩy đủ thông tin</p>
        content.status = "warning"
        setAlertShow(true)
        return;
      }
    axios.post(URL_backend+"/api/v1/login",
      {
        email,pass
      }
    ).then(
      res => {
        if(res.data && + res.data.ErrorCode ===0)
          {
            // Expires Time : 1 hour
            let minutes = 60;
            let expires = new Date()
            expires.setTime(expires.getTime() + minutes * 60 *1000)
            setCookie('access_token',res.data.data.token,{path: '/',expires})
            navigate('/')
          }
       if(+res.data.ErrorCode === -2)
        {
            content.content = <p>Email không hợp lệ</p>
            content.status = "warning"
            setAlertShow(true)
            return;
        }
        content.content = <p>Đăng nhập thất bại</p>
        content.status = "warning"
        setAlertShow(true)
      }
    )
  }
  return (
    <>
      {!modeForgot ? (
        <Form>
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control type="email" name="email" placeholder="name@example.com"  value={email} onChange={handleEmailInput}/>
          </FloatingLabel>
          {/*  */}
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control type="password"  name="pass" placeholder="Password" value={pass}  onKeyDown={
              (e)=>{
                if(e.key == "Enter")
                  handleOnSubmit()
              }
            } onChange={handlePassInput}/>
          </FloatingLabel>
          {/*  */}
          <div className="d-flex justify-content-end forgot_pass">
            <span onClick={()=> {setModeForgot(true)}}>Quên mật khẩu</span>
          </div>
          {/*  */}
          <div className="btn_submit_container d-flex justify-content-center p-4">
            <Button variant="primary" type="button" onClick={handleOnSubmit}>
              Đăng Nhập
            </Button>
          </div>
        </Form>
      ) : (
        <Form>
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control type="email" placeholder="name@example.com"  value={email} onChange={handleEmailInput}/>
          </FloatingLabel>
          {/*  */}
          <div className="btn_submit_container d-flex justify-content-center p-4">
            <Button variant="primary" type="button" onClick={handleForgotButon}>
              Quên mật khẩu
            </Button>
          </div>
        </Form>
      )}
    </>
  );
}
