import { Container,Row,Col } from "react-bootstrap";
import { faCirclePlay, faCirclePause, faL } from "@fortawesome/free-solid-svg-icons";
//FontAweSome
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Button from 'react-bootstrap/Button';
import "../css/ItemMusic.css"
//Testing
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {URL_public, path_browser} from "../utils/constant"
import { AudioCurrentContext } from "../context/AudioCurrentContext";
import { getListendList, increaseView } from "../services/SongServices";
import { addListendSong,CheckListendSong,UpdateTimeListendSong ,addFavSong, RemoveFavSong, addFollowArtist, removeFollowArtist} from "../services/UserServices";
function ItemMusic({idx,info}) {
  //
  // use context
  const string_source = URL_public + info?.filenhac
  const {setParamCurrent,setFavCodeList,setArtistCodeList,artistCodeList,favCodeList,userCode,setListendList,currentElement,setCurrentElement,audioCurrent} = useContext(AudioCurrentContext);
  // Navigate
  const navigate = useNavigate();
  const [mode,setMode] = useState(false);
  const [modeFav,setModeFav] = useState(false);
  const [modeFollow,setModeFollow] = useState(false)
  useEffect( ()=>{
    setMode(audioCurrent.current.src == string_source && currentElement.isPlay)
    setModeFav(favCodeList?.includes(info?.MABH))
    setModeFollow(artistCodeList?.includes(info?.MANS))
  },[currentElement,favCodeList,artistCodeList])
  //
  //Handle Order
  const handleOrderListendList = async () => {
      const value = await getListendList(userCode)
      const arr =[]
      if(+value.ErrorCode ===0)
        {
          value.data.forEach(element => {
            arr.push(element)
          });
          setListendList([...arr])
        }
  }
   //IncreaseView Handler
  const putIncreaseView = async (maBH) =>
  {
    const value = await  increaseView(maBH)
    if(+value.ErrorCode !==0)
        window.location.reload()
  }
  //
  const handleClickFav = async (e) =>{
    const maBH = e.target.getAttribute('data_ma')
    if(!modeFav)
      {
        await addFavSong(maBH,userCode)
        setModeFav(true)
        // let arr = [...favCodeList]
        // arr.push(maBH)
        // setFavCodeList([...arr])
        setParamCurrent('addFav')
        return;
      }
      await RemoveFavSong(maBH,userCode)
      setModeFav(false)
      // let arr = [...favCodeList]
      // arr = arr.filter((vl)=> vl !== maBH)
      // setFavCodeList([...arr])
      setParamCurrent('removeFav')
  }
  //
  const handleClickFollow = async(e)=>{
    const maNS = e.target.getAttribute('data_artist')
    if(!modeFollow)
      {
        await addFollowArtist(maNS,userCode)
        setModeFollow(true)
        setParamCurrent('addFollow')
        return;
      }
      await removeFollowArtist(maNS,userCode)
      setModeFollow (false)
      setParamCurrent('removeFolow')
  }
  //
  const ListenMusic = async (maBH,maND) =>{
    let value = await  CheckListendSong(maBH,maND);
    if(+value.ErrorCode ==0)
      {
        await UpdateTimeListendSong(maBH,maND)
        await handleOrderListendList()
        return;
      }
    await addListendSong(maBH,maND)
    await handleOrderListendList()
  }
  //
  const handleOnClickInfoArtist = (e) =>{
    e.preventDefault(); 
    const MANS =e.target.getAttribute('data_artist')
    navigate(path_browser.ARTIST+`?id=${MANS}`);
  }
  const MusicManager = (e,mode) => {
    let maBH = ''
    if(e.target.nodeName =='svg'){
      maBH = e.target.getAttribute('data_mabh')
    }
    else
    {
      maBH = e.target.parentElement.getAttribute('data_mabh')
    }
    ListenMusic(maBH,userCode)
    putIncreaseView(maBH)
    setMode(mode);
    if(mode)
     {  
        //load and set src
        audioCurrent.current.load()
        audioCurrent.current.setAttribute('src',string_source);
        audioCurrent.current.play()
        setCurrentElement({...info,idx,isPlay:true})
        return;
     }
     setCurrentElement({...info,idx,isPlay:false})
     audioCurrent.current.pause()
  }
  //
 
  return (
    // <>
   <Container className="it_music rounded_shape"> 
    <Row >
      <Col xs ={{ span: 6, offset: 3}}   md ={{ span: 3, offset: 0}} className="mt-5">
        <div className="it_logo mt-2" data_artist={info?.MANS} onClick={ handleOnClickInfoArtist} >
          <img src={URL_public+info?.AnhNS} data_artist={info?.MANS} alt="" />
          <p className="author text_out" data_artist={info?.MANS}>{info?.TenNS}</p>
        </div>
        <Button variant="outline-primary" className=" text_normal  it_btn_follow"  data_artist={info?.MANS} onClick={handleClickFollow} active={modeFollow} >{modeFollow ? 'Đã Theo dõi':'Theo dõi'} </Button>
      </Col>
      <Col xs={{ span: 12}} md={{ span: 8, offset: 0 }}>
        <div className="it_banner mt-2 ">
          <img src={URL_public+info?.AnhBH} className="rounded_shape" alt="" />
        </div>
      </Col>
    </Row>
    <Row className="mt-3">
      <Col xs ={{ span: 3, offset: -1 }} md ={{ span: 3, offset: -1 }} >
       {
        (mode) ?  <FontAwesomeIcon icon={faCirclePause} data_mabh={info?.MABH}  onClick={(e) => MusicManager(e,false)} className="it_player text_out " /> :
                  <FontAwesomeIcon icon={faCirclePlay}   data_mabh={info?.MABH}  onClick={(e) => MusicManager(e,true)} className="it_player text_out " /> 
       }
      </Col>
      <Col xs ={8} md ={{span:7, offset:-3}}>
        <p className="it_content text_normal">
          {info?.NoiDung||`Lorem ipsum dolor sit amet consectetur adipisicing elit. A
          dipisci placeat ipsum, cumque consectetur voluptates beatae eve
          niet eligendi earum. Praesentium laborum sapiente eius cupiditate au
          t. Nulla maiores ut eligendi quaerat a? Inventore voluptas maiores, ac
          cusantium reprehenderit repudiandae ducimus doloribus, quae quaerat iure d
          olor deleniti voluptatibus facere dignissimos nam? Quos, asperiores. Assumenda.` }
          </p>
      </Col>
      <Col  xs ={{span:2 , offset:6}} md ={{span:2,offset:0}}>
        <Button variant="outline-primary" className="it_btnLike text_normal btn_love" data_ma={info?.MABH} active={modeFav} onClick={handleClickFav}>{modeFav ? 'Đã yêu thích':'Yêu thích'}</Button>
      </Col>
    </Row>
  </Container>
  // </>
  );
}

export default ItemMusic;
