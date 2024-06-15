import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, ButtonGroup, Form, Stack } from "react-bootstrap";
import { justin } from "../images/ImageManager";
import Button from "react-bootstrap/Button";
import "../css/Artistpage.css";
import AlbumComponent from "../component/AlbumComponent";
import { AudioCurrentContext } from "../context/AudioCurrentContext";
import { URL_public } from "../utils/constant";
import NotFound from "../component/NotFound";
import { addFollowArtist, removeFollowArtist } from "../services/UserServices";
import { getArtistByCode } from "../services/ArtistServices";
export default function Artistpage() {
  const {userCode,paramCurrent,params,setParamCurrent,artistCodeList,infoArtists} = useContext(AudioCurrentContext);
  const [modeFollow,setModeFollow] = useState(true)
  const [infoArtistID,setInfoArtistId] = useState()
  //
  // Load Method
  const FetchMyArtist = async() =>{
    //console.log(infoArtists);
    const id = params.get('id')
    if(id)
    {
      const value = await getArtistByCode(id)
      setInfoArtistId(value.data)
      setModeFollow(artistCodeList.includes(value.data[0]?.MANS))
      return;
    }
    setInfoArtistId([])
  }
  // 
  const handleClickFollow = async(e)=>{
    const maNS = e.target.getAttribute('data_artist')
    if(!modeFollow)
      {
        await addFollowArtist(maNS,userCode)
        setModeFollow(true)
        window.location.reload()
        return;
      }
      await removeFollowArtist(maNS,userCode)
      setModeFollow (false)
      window.location.reload()
  }
  //
  useEffect( ()=>{
    FetchMyArtist()
  },[paramCurrent])
  return (
       <>
        <Stack className="artist_page mt-5 pt-3">
          {/* Search ID */}
        {  infoArtistID?.map((info,idx)=>
        { return <Container key={idx}>
              <Row>
                <Col xs={12}>
                  <Row className="artist mt-3 p-2">
                    <Col className="artist_head"  xs ={12} md ={4}>
                      <div className="artist_img">
                        <img src={URL_public + info?.Anh} alt="" />
                      </div>
                    </Col>
                    <Col className="artist_content" xs ={12} md={8}>
                      <h3 className="text_out">{info?.TenNS}</h3>
                      <p className="text_normal">
                        {info?.MoTa}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} className="author_spec mt-3 p-2">
                  <Row>
                    <Col  xs={12} md={3} className="mt-2">
                      <p>Follower : 100 </p>
                    </Col>
                    <Col xs={12} md={3} className="mt-2">
                      <p>Tổng số bài hát : 100</p>
                    </Col>
                    <Col xs={12} md={3} className="mt-2">
                      <p>Lượt xem theo tháng : 100</p>
                    </Col>
                    <Col xs={12} md={3} className="mt-1">
                    <Button variant="outline-primary" className=" text_normal  it_btn_follow"  data_artist={info?.MANS} onClick={handleClickFollow} active={modeFollow} >{modeFollow ? 'Đã Theo dõi':'Theo dõi'} </Button>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} className=" mt-3 p-2">
                  {/* Album */}
                  <Row className="album p-2 my-2">
                    <AlbumComponent code={info?.MANS} TenNS ={info?.TenNS}/>
                  </Row>
                </Col>
              </Row>
        </Container>
      })}
      {/* MY ARTIST */}
       {infoArtistID?.length ===0   && infoArtists?.length ===0 ? <NotFound content={'Bạn chưa theo dõi một tác giả nào cả !'}/> : ''}
       { infoArtistID?.length ===0  && infoArtists?.map((info,idx)=>
        { return <Container key={idx}>
              <Row>
                <Col xs={12}>
                  <Row className="artist mt-3 p-2">
                    <Col className="artist_head"  xs ={12} md ={4}>
                      <div className="artist_img">
                        <img src={URL_public + info?.AnhNS} alt="" />
                      </div>
                    </Col>
                    <Col className="artist_content" xs ={12} md={8}>
                      <h3 className="text_out">{info?.TenNS}</h3>
                      <p className="text_normal">
                        {info?.MoTa}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} className="author_spec mt-3 p-2">
                  <Row>
                    <Col  xs={12} md={3} className="mt-2">
                      <p>Follower : 100 </p>
                    </Col>
                    <Col xs={12} md={3} className="mt-2">
                      <p>Tổng số bài hát : 100</p>
                    </Col>
                    <Col xs={12} md={3} className="mt-2">
                      <p>Lượt xem theo tháng : 100</p>
                    </Col>
                    <Col xs={12} md={3} className="mt-1">
                    <Button variant="outline-primary" className=" text_normal  it_btn_follow"  data_artist={info?.MANS} onClick={handleClickFollow} active={modeFollow} >{modeFollow ? 'Đã Theo dõi':'Theo dõi'} </Button>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} className=" mt-3 p-2">
                  {/* Album */}
                  <Row className="album p-2 my-2">
                    <AlbumComponent code={info?.MANS} TenNS ={info?.TenNS}/>
                  </Row>
                </Col>
              </Row>
        </Container>
      })}
        </Stack>

       </>
  );
}
