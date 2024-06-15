import Form from 'react-bootstrap/Form';
import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import "../css/Profile.css";
import { URL_backend, URL_public } from "../utils/constant";
import StackMusic from "../component/StackMusic";
import { AudioCurrentContext } from "../context/AudioCurrentContext";
import { useNavigate } from "react-router-dom";
import Alert from "../component/Alert";
import { ConvertDate, UpdateInfoUser } from '../services/UserServices';
import axios from 'axios';
export default function Profile() {
  // Navigate
  const navigate = useNavigate();
  const [alertShow, setAlertShow] = useState(false);
  let content_alert = useRef({content :'',status:'',heading:''})
  const {userProfile,favList,setParamCurrent} = useContext(AudioCurrentContext);
  //console.log(userProfile);
  const [pagemode, setPageMode] = useState(0);
  const inputRef = useRef()
  const upload_File = useRef()
  const handleBtnChange = (index) => {
    //Check current pagemode
    if (pagemode !== index) setPageMode(index);
    if(index ===2)
      {
        handleLogOut()
      }
  };
  //handle logout
  const handleLogOut = ()=>{
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/sign')
    window.location.reload()
  }
  //
  const OptionAlert = (heading,status,func,mode = false ) =>{
    content_alert.current.heading = heading
    content_alert.current.status = (status) ? "sucess" : 'warning'
    content_alert.current.content = <div>
      <Form.Control ref={inputRef} type={mode ? "date" : "text"} />
      <br />
      <Button
            variant="outline-primary"
            onClick={func}
            >
             Xác nhận
      </Button>
    </div>
    setAlertShow(true)
  }
  //
  const handleOpenUpLoad = async () => {
    const file_image =upload_File.current.files[0]
    // Create an object of formData
    const formData = new FormData();
    formData.append('file',file_image)
    const value = await axios.post(URL_backend+"/upload", formData);
    const anhND= value?.data?.data
    const ngaySinh = ConvertDate(new Date(userProfile?.NgaySinh).toLocaleDateString())
    if(anhND)
      {
        const res = await UpdateInfoUser(userProfile?.MAND,userProfile?.MaLoai ,userProfile?.MaQT ,userProfile?.HoTen,userProfile?.GioiTinh,ngaySinh,userProfile?.Email,userProfile?.MatKhau,anhND)
        if(+res.ErrorCode === 0)
          {
            setParamCurrent('change_avatar'+anhND+new Date().getTime()+userProfile?.MAND)
            content_alert.current.status ="sucess"
            content_alert.current.content = <p>Thay đổi thành công</p>
            setAlertShow(true)
            return;
          }
      }
      content_alert.current.status ="warning"
      content_alert.current.content = <p>Sự thay đổi không thành công</p>
      setAlertShow(true)
  }
  //
  const handleOnClickImage = async ()=>{
    upload_File.current.click();
  }
  //
  const handleOnClickFullName = async() =>{
    const newName = inputRef.current.value
    const ngaySinh = ConvertDate(new Date(userProfile?.NgaySinh).toLocaleDateString())
    setAlertShow(false)
    const value = await UpdateInfoUser(userProfile?.MAND,userProfile?.MaLoai,userProfile?.MaQT,newName,userProfile?.GioiTinh,ngaySinh,userProfile?.Email,userProfile?.MatKhau,userProfile?.Anh)
    if(+value.ErrorCode ===0 )
      {
        setParamCurrent('change_name'+newName+new Date().getTime()+userProfile?.MAND)
        content_alert.current.status ="sucess"
        content_alert.current.content = <p>Thay đổi thành công</p>
        setAlertShow(true)
        return;
      }
      content_alert.current.status ="warning"
      content_alert.current.content = <p>Sự thay đổi không thành công</p>
      setAlertShow(true)
  }
  //
  const handleOnClickEmail = async()=>{
    const newEmail = inputRef.current.value
    const ngaySinh = ConvertDate(new Date(userProfile?.NgaySinh).toLocaleDateString())
    setAlertShow(false)
    const value = await UpdateInfoUser(userProfile?.MAND,userProfile?.MaLoai,userProfile?.MaQT,userProfile?.HoTen,userProfile?.GioiTinh,ngaySinh,newEmail,userProfile?.MatKhau,userProfile?.Anh)
    if(+value.ErrorCode ===0 )
      {
        setParamCurrent('change_email'+newEmail+new Date().getTime()+userProfile?.MAND)
        content_alert.current.status ="sucess"
        content_alert.current.content = <p>Thay đổi thành công</p>
        setAlertShow(true)
        return;
      }
      content_alert.current.status ="warning"
      content_alert.current.content = <p>Sự thay đổi không thành công</p>
      setAlertShow(true)
  }
  //
  const handleOnClickPass = async()=>{
    const newPass = inputRef.current.value
    const ngaySinh = ConvertDate(new Date(userProfile?.NgaySinh).toLocaleDateString())
    setAlertShow(false)
    const value = await UpdateInfoUser(userProfile?.MAND,userProfile?.MaLoai,userProfile?.MaQT,userProfile?.HoTen,userProfile?.GioiTinh,ngaySinh,userProfile?.Email,newPass,userProfile?.Anh)
    if(+value.ErrorCode ===0 )
      {
        setParamCurrent('change_pass'+newPass+new Date().getTime()+userProfile?.MAND)
        content_alert.current.status ="sucess"
        content_alert.current.content = <p>Thay đổi thành công</p>
        setAlertShow(true)
        return;
      }
      content_alert.current.status ="warning"
      content_alert.current.content = <p>Sự thay đổi không thành công</p>
      setAlertShow(true)
  }
  //
  const handleOnClickBirth = async()=>{
    const newBirth = inputRef.current.value
    setAlertShow(false)
    const value = await UpdateInfoUser(userProfile?.MAND,userProfile?.MaLoai,userProfile?.MaQT,userProfile?.HoTen,userProfile?.GioiTinh,newBirth,userProfile?.Email,userProfile?.MatKhau,userProfile?.Anh)
    if(+value.ErrorCode ===0 )
      {
        setParamCurrent('change_birth'+newBirth+new Date().getTime()+userProfile?.MAND)
        content_alert.current.status ="sucess"
        content_alert.current.content = <p>Thay đổi thành công</p>
        setAlertShow(true)
        return;
      }
      content_alert.current.status ="warning"
      content_alert.current.content = <p>Sự thay đổi không thành công</p>
      setAlertShow(true)
  }
  const styleModeAccount ={
    height: '200px',
    marginBottom: '30px'
  }
  return (
    <>
        <Container className="profile_it">
          <Row className="mt-3">
            <Col xs={{ span: 4, offset: 4 }}>
              <div className="info_acc" style={ pagemode ===0 ? styleModeAccount:{}} >
                {pagemode ==1 ? '' : <img src={URL_public+userProfile?.Anh} style={{cursor :'pointer'}} alt="" onClick={handleOnClickImage} />}
                <p>{userProfile?.HoTen}</p>
              </div>
            </Col>
            <Col xs={{ span: 12 }} className="my-3">
              <ButtonGroup
                aria-label="Basic example"
                className="btn_sign d-flex"
              >
                <Button
                  variant="outline-primary"
                  active={pagemode == 0 ? true : false}
                  onClick={() => {
                    handleBtnChange(0);
                  }}
                >
                  Tài khoản
                </Button>
                <Button
                  variant="outline-primary"
                  active={pagemode == 1 ? true : false}
                  onClick={() => {
                    handleBtnChange(1);
                  }}
                >
                  Yêu thích
                </Button>
                <Button
                  variant="outline-primary"
                  active={pagemode == 2 ? true : false}
                  onClick={() => {
                    handleBtnChange(2);
                  }}
                >
                  Đăng xuất
                </Button>
              </ButtonGroup>
            </Col>
            <Col xs={{ span: 12 }} className="my-3">
              {pagemode == 0 ? (
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <td>Họ và tên</td>
                      <td>{userProfile?.HoTen}
                     
                      </td>
                      <td>
                        <Button variant="outline-primary" onClick={()=>{OptionAlert('Nhập thay đổi họ tên',true,handleOnClickFullName)}}>Thay đổi</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{userProfile?.Email}</td>
                      <td>
                        <Button variant="outline-primary" onClick={()=>{OptionAlert('Nhập thay đổi email',true,handleOnClickEmail)}}>Thay đổi</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Mật khẩu</td>
                      <td> *************</td>
                      <td>
                        <Button variant="outline-primary" onClick={()=>{OptionAlert('Nhập thay đổi mật khẩu',true,handleOnClickPass)}} >Thay đổi</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Loại tài khoản</td>
                      <td> {userProfile?.TenQuyen} </td>
                      <td>
                        <Button variant="outline-primary">Liên hệ</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>Ngày sinh</td>
                      <td> {  new Date(userProfile?.NgaySinh).toLocaleDateString()} </td>
                      <td>
                        <Button variant="outline-primary" onClick={()=>{OptionAlert('Nhập thay đổi ngày sinh',true,handleOnClickBirth,true)}}>Thay đổi</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <div className="list_fav">
                 <StackMusic list={favList}/>
                </div>
              )}
            </Col>
          </Row>
          <Alert show = {alertShow} onHide= {()=> setAlertShow(false)}
            heading={content_alert.current.heading}
            content = {content_alert.current.content}
            status = {content_alert.current.status}    
          />
        </Container>
            <input type="file" ref={upload_File} style={{display:'none'}} onChange={handleOpenUpLoad}/>
        </>
  );
}
