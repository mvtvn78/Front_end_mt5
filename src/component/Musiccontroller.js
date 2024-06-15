import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//FontAweSome
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faMaximize,faRotate,faCirclePlay, faCirclePause ,faSquareCaretLeft,faSquareCaretRight,faVolumeXmark
  ,faVolumeHigh
 } from '@fortawesome/free-solid-svg-icons';
import "../css/Musiccontroller.css"
import { useRef, useState } from "react";
import { useEffect } from 'react';
import Liricle from 'liricle';
import { AudioCurrentContext } from '../context/AudioCurrentContext';
import { useContext } from 'react';
import { URL_public } from '../utils/constant';
import { CheckListendSong, UpdateTimeListendSong, addListendSong } from '../services/UserServices';
import { getListendList } from '../services/SongServices';
export default function Musiccontroller() {
  // use Context
  const {currentElement,setListendList,userCode,setCurrentElement,songList,audioCurrent} = useContext(AudioCurrentContext);
  const liricle = useRef( new Liricle());
  const [loop,setLoop] = useState(false)
  const [lyric_curr,setLyric_curr] = useState('')
  const [play,setPlay] = useState(false);
  const [isFullScreen,setIsFullScreen] = useState(false)
  const [mute,setMute] = useState(false);
  //Value : 0 - 100 
  const [timeCur,setTimeCur] = useState(0)
  const [speakerPoint,setSpeakerPoint] = useState(100)
  //Display state
  const [timeDisplay,setTimeDisplay] = useState(0)
  const [durDisplay,setDurDisplay] = useState(0)
  //Format to display
  function sToTime(t) {
    return padZero(parseInt((t / (60)) % 60)) + ":" + 
           padZero(parseInt((t) % 60));
  }
  function padZero(v) {
    return (v < 10) ? "0" + v : v;
  }
  //Handle loop Icon
  const handleLoopMode = (mode)=>{
    if(audioCurrent.current)
    {
      setLoop(mode)
      audioCurrent.current.loop = mode;
    }
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
  // handle Next
  const handleNext = () =>{
      if(currentElement?.idx == songList.length -1 || !currentElement)
        return;
      const indx = currentElement.idx;
      ListenMusic(songList[indx+1].MABH,userCode)
      audioCurrent.current.load()
      audioCurrent.current.setAttribute('src',URL_public + songList[indx+1]?.filenhac);
      setLyric_curr(songList[indx+1].TenBH  + " - "+songList[indx+1].TenNS)
      audioCurrent.current.play()
      setCurrentElement({...songList[indx+1],idx: indx+1,isPlay:true})
  }
  //handle previous
  const handPrevious = () =>{
    if(currentElement?.idx == 0 || !currentElement)
      return;
    const indx = currentElement.idx;
    ListenMusic(songList[indx-1].MABH,userCode)
    audioCurrent.current.load()
    audioCurrent.current.setAttribute('src',URL_public + songList[indx-1]?.filenhac);
    setLyric_curr(songList[indx-1].TenBH + " - " +songList[indx-1].TenNS)
    audioCurrent.current.play()
    setCurrentElement({...songList[indx-1],idx: indx-1,isPlay:true})
  }
  //Handle Speaker Point
  const handleSpeakPoint = (e) => {
    if(audioCurrent.current)
    {
      const real_point = e.target.value / 100;
      audioCurrent.current.volume= real_point;
      setSpeakerPoint(e.target.value)
    }
  }
  //Handle Control Time change
  const handleTimeChange = (e) => {
    if(audioCurrent.current && audioCurrent.current.src!='')
      {
        const value = e.target.value * (audioCurrent.current.duration / 100)
        audioCurrent.current.currentTime = value;
        setTimeCur( e.target.value)
        MusicManager(true)
      }
  }
  //Handle user escape Fullscreen mode
  const exitHandler = () => {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      setIsFullScreen(false)
    }
  }
  //Handle audio has finished playing
  const handleAudoEnd = () => {
    setPlay(false);
    setCurrentElement((prev) =>  { return {...prev,isPlay:false}})
  }
  //Function to play
  const MusicManager = (mode) => {
    //console.log("CHECK AUDIO"+audioCurrent.current.src);
    if( audioCurrent.current.src != '' &&audioCurrent.current)
      {
        setPlay(mode);
        if(mode == true)
          {
            audioCurrent.current.play()
            ListenMusic(currentElement.MABH,userCode)
            //console.log("currentElement >> ",currentElement);
            setCurrentElement((prev) =>  { return {...prev,isPlay:true}})
            return;
          }
        audioCurrent.current.pause()
        setCurrentElement((prev) =>  { return {...prev,isPlay:false}})
      }
  }
  // Toggle Screen
  const toggleFullScreen = () => {
    if(audioCurrent.current)
    {
      const element = document.getElementById("m_controller")
      const isFullScreen = document.fullscreenElement;
      if(isFullScreen)
        {
          setIsFullScreen(false)
          document.exitFullscreen()
        }
        else {
          setIsFullScreen(true)
          element.requestFullscreen()
        }
    }
  }
  //Get lyrics 
  const getLyrics = (line) => {
    //console.log("current line => ", line);
    setLyric_curr(line.text)
  }
  //get TimeCurrent Audio
  const getTimeCurrent =  () => {
    if(audioCurrent.current)
      {
        const time = audioCurrent.current.currentTime;
        setTimeDisplay(sToTime(time))
        if(audioCurrent.current.duration)
       {
        setTimeCur((time / audioCurrent.current.duration)*100)
        setDurDisplay(sToTime(audioCurrent.current.duration))
       }
        // sync lyric when the audio time updated
        liricle.current.sync(time, false);
      }
  }
  //UseEffect hook
  useEffect( () => {
    
    // listen to on load event
      liricle.current.on("load", data => {
        //console.log(data);
      });
      // listen to on sync event
      liricle.current.on("sync",getLyrics );
      // load lyric
      liricle.current.load({ text:currentElement&&currentElement.LoiBatHat });

      // adjust lyric speed
      // positive value => speed up
      // negative value ​​=> slow down
      liricle.current.offset = 200; // value in milliseconds.
      if(audioCurrent.current)
        {
          audioCurrent.current.addEventListener("timeupdate",getTimeCurrent);
          audioCurrent.current.addEventListener("ended", handleAudoEnd)
        }
        document.addEventListener('fullscreenchange', exitHandler);
        document.addEventListener('webkitfullscreenchange', exitHandler);
        document.addEventListener('mozfullscreenchange', exitHandler);
        document.addEventListener('MSFullscreenChange', exitHandler);
      // Clean up
      return () => {
        document.removeEventListener('fullscreenchange', exitHandler);
        document.removeEventListener('webkitfullscreenchange', exitHandler);
        document.removeEventListener('mozfullscreenchange', exitHandler);
        document.removeEventListener('MSFullscreenChange', exitHandler);
        if(audioCurrent.current)
          {
          audioCurrent.current.removeEventListener('timeupdate',getTimeCurrent)
          audioCurrent.current.removeEventListener("ended", handleAudoEnd)
          }
      }
  },[currentElement])
  return (
    <>
    {/* FULLSCREEN MODE */}
    <Container fluid className='m_controller' id ="m_controller"  >
    {(isFullScreen) ? 
      <>
        <Row>
        <Col className='max_screen'  xs ={12} >
          <div className='current_detail'>
            <FontAwesomeIcon icon={faMaximize} id='icon_max' onClick={toggleFullScreen} className='icon_controllers fullscren'/>
          </div>
        </Col>
        <Col xs ={12} className='trigger_containter'  >
          <div className="fullscreen_img"> 
              <p className='lyric-line'>{lyric_curr}</p>
          </div>
          </Col>
          {/*  */}
          <Col xs ={12} id="handler" className='trigger_item'>
          <div className='controller_bar'>
            <span id="current-time" className="time">{timeDisplay}</span>
            <input id="typeinp" type="range" min="0" max="100"  step="1" value={timeCur} onChange={handleTimeChange}/>
            <span id="duration" className="time">{durDisplay}</span>
          </div>
        </Col>
          <Col className='controllers trigger_item' xs={12}  >
            <div className='current_detail'> 
              <FontAwesomeIcon icon={faSquareCaretLeft} className='icon_controllers'  onClick={handPrevious} />
                {
                (currentElement?.isPlay) ?  <FontAwesomeIcon icon={faCirclePause}  className='icon_controllers '  onClick={() => MusicManager(false)}  /> :
                          <FontAwesomeIcon icon={faCirclePlay}   className='icon_controllers '  onClick={() => MusicManager(true)} /> 
                }
                <FontAwesomeIcon icon={faSquareCaretRight}  className='icon_controllers'  onClick={handleNext} />
                {
                  (loop)?
                  <FontAwesomeIcon icon={faRotate}  onClick={()=> {handleLoopMode(!loop)}}  className='icon_controllers active_loop'  />
                  :
                  <FontAwesomeIcon icon={faRotate}  onClick={()=> {handleLoopMode(!loop)}}  className='icon_controllers'  />
                }
            </div>
        </Col>  
      </Row>
      </>
    :
    <>
     {/* BASE MODE */}
    <Row>
      <Col xs ={{span: 6 ,offset:3}} id="handler">
        <div className='controller_bar'>
          <span id="current-time" className="time">{timeDisplay}</span>
          <input id="typeinp" type="range" min="0" max="100"  step="1" value={timeCur} onChange={handleTimeChange}/>
          <span id="duration" className="time">{durDisplay}</span>
        </div>
      </Col>
      <Col xs ={{span: 2 ,offset:10}} md ={{span: 2 ,offset:1}} id="volume">
        <div className='controller_bar'>
          <input id="volume-slider" type="range" min="0" max="100"  value={speakerPoint} onChange={handleSpeakPoint}/>
          {
            mute ? <FontAwesomeIcon icon={faVolumeXmark} className='speaker_icon' onClick={() => {
             if(audioCurrent.current)
              {
                audioCurrent.current.volume =1 
                setSpeakerPoint(100)
                setMute(!mute)
              }
            }}/> :  <FontAwesomeIcon icon={faVolumeHigh} className='speaker_icon' onClick={() => {
              if(audioCurrent.current)
                {
                  audioCurrent.current.volume =0 
                  setSpeakerPoint(0)
                  setMute(!mute)
                }
            }}/>
          }
        </div>
      </Col>
    </Row>
    <Row className='current_song'>
      <Col xs={2} md={2}>
        <img src={currentElement && URL_public+ currentElement.AnhBH} id="current_banner" className='rounded_shape'/> 
      </Col>
      <Col  xs={{span:7 , offset:2}}  md={{span:2 , offset:0}}className='current_title'>
        <div className='current_detail'>
          <h3 className='text_out'>{currentElement && currentElement.TenBH}</h3>
          <p className="author text_normal">{currentElement && currentElement.TenNS}</p>
        </div>
      </Col>
      <Col className='controllers' xs={{span:12,offset:0}} md={{span:5 ,offset:0}} >
       <div className='current_detail'>
          <FontAwesomeIcon icon={faSquareCaretLeft} className='icon_controllers'  onClick={handPrevious}/>
        {/*  */}
          {
         (currentElement?.isPlay) ?  <FontAwesomeIcon icon={faCirclePause}  className='icon_controllers '  onClick={() => MusicManager(false)}  /> :
                    <FontAwesomeIcon icon={faCirclePlay}   className='icon_controllers '  onClick={() => MusicManager(true)} /> 
          }
          <FontAwesomeIcon icon={faSquareCaretRight}  className='icon_controllers'  onClick={handleNext} />
          {/*  */}
          {
            (loop)?
            <FontAwesomeIcon icon={faRotate}  onClick={()=> {handleLoopMode(!loop)}}  className='icon_controllers active_loop'  />
            :
            <FontAwesomeIcon icon={faRotate}  onClick={()=> {handleLoopMode(!loop)}}  className='icon_controllers'  />
          }
       </div>
      </Col>
      <Col className='max_screen'  xs ={1} md={{span:1,offset:2}}>
        <div className='current_detail'>
          <FontAwesomeIcon icon={faMaximize} id='icon_max' onClick={toggleFullScreen} className='icon_controllers'/>
        </div>
      </Col>
    </Row>
    </>
    }
  </Container>
    </>
  )
}
