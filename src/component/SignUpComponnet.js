import React ,{ useEffect, useState }from "react";
import { Button, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
//Axios
import axios from "axios";
import { URL_backend } from "../utils/constant";
export default function SignUpComponnet({content,setAlertShow}) {
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const [codeNation,setCodeNation] = useState('')
  const [codeNations,setCodeNations] = useState([])
  const [fullName,setFullName] = useState('')
  const [gender,setGender] = useState(1)
  const [birthday,setBirthday] = useState('')
  const handleSubmit = (e)=>{
    console.log(birthday);
    if(!fullName || !email || !pass || !birthday)
      {
        content.content = <p>Vui lòng điền đẩy đủ thông tin</p>
        content.status = "warning"
        setAlertShow(true)
        return;
      }
    axios.post(URL_backend+"/api/v1/register",
    {
      email,pass,
      "maQT":codeNation,
      "hoTen":fullName,
      "gioiTinh":gender,
      "ngaySinh":birthday
    }
  ).then(
    res => {
      if(res.data && + res.data.ErrorCode ===0)
        {
          //Reload to sign in
          content.content = <p>Đăng ký thành công</p>
          content.status = "sucess"
          setAlertShow(true)
          return;
        }
      if(+res.data.ErrorCode === -2 )
        {
          content.content = <p>Email không hợp lệ</p>
          content.status = "warning"
          setAlertShow(true)
          return;
        }
        if(+res.data.ErrorCode === -3 )
          {
            content.content = <p>Email đã tồn tại</p>
            content.status = "warning"
            setAlertShow(true)
            return;
          }
          content.content = <p>Đăng ký thất bại</p>
          content.status = "warning"
          setAlertShow(true)
    }
  )
   
  }
  useEffect(() => {
    async function fetchData() {
      // Fetch data and destructuring
      const { data:{data} } = await axios.get(URL_backend+"/api/v1/nations");
      const results = []
      // Store results in the results array
      data.forEach((value) => {
        results.push({
          key: value.MaQT ,
          value: value.TenQT,
        });
      });
      // Update the options state
      setCodeNations([
        ...results
      ])
    }
    // Trigger the fetch
    fetchData();
  }, []);
  return (
    <Form>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text_signin">
          Họ và tên
        </Form.Label>
        <Col sm="10">
          <Form.Control name="hoTen" type="text" placeholder="Mai Van Tien" onChange={(e) => {setFullName(e.target.value)}} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2" className="text_signin">
          Email
        </Form.Label>
        <Col sm="10">
          <Form.Control name="email"  type="text" placeholder="abc@gmail.com" onChange={(e) => {setEmail(e.target.value)}}   />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text_signin">
          Giới tính
        </Form.Label>
        <Col sm="10">
          <div className="radioContainer d-flex gap-5" name="gioiTinh" >
            <Form.Check
              name="group1"
              label="Nam"
              type="radio"
              className="text_signin"
              aria-label="radio 1"
              checked = {(gender === 1)} 
              onChange={ (e)=> setGender(1)}
            />
            <Form.Check
              name="group1"
              label="Nữ"
              type="radio"
              className="text_signin"
              aria-label="radio 1"
              checked = {(gender === 0)} 
              onChange={ (e)=> setGender(0)}
            />
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2" className="text_signin">
          Mật khẩu
        </Form.Label>
        <Col sm="10">
          <Form.Control name="pass" type="password" placeholder="Password" onChange={(e) => {setPass(e.target.value)}} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm="2" className="text_signin">
          Ngày sinh
        </Form.Label>
        <Col sm="10">
          <Form.Control name="ngaySinh"  type="date"  placeholder="Due date" onChange={(e) => {setBirthday(e.target.value)}} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mt-3">
        <Form.Label column sm="2" className="text_signin">
          Quốc tịch
        </Form.Label>
        <Col sm="10">
          {/* getCodeNation */}
          <Form.Select aria-label="Default select example" name="maQT" className="cursor_pointer" onChange={ (e) => {
            setCodeNation(e.target.value)
          }} >
          {codeNations.map((option,idx) => {
            return (
              <option key={idx} value={option.key}>
                {option.value}
              </option>
            );
        })}
          </Form.Select>
        </Col>
      </Form.Group>

      <div className="btn_submit_container d-flex justify-content-center p-4">
        <Button variant="primary" type="button" onClick={handleSubmit}>
          Đăng ký
        </Button>
      </div>
    </Form>
  );
}
