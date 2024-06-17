import React, { useEffect, useLayoutEffect, useRef, useState  } from "react";
import Container from "react-bootstrap/Container";
import StackMusic from "../component/StackMusic";
import Musiccontroller from "../component/Musiccontroller";
import "../css/Homepage.css";
import BarComponnet from "../component/BarComponnet";
import BarTrigger from "../component/BarTrigger";
// Create Context
import { AudioCurrentContext } from "../context/AudioCurrentContext";
//navigate
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
// Cookies
import { useCookies } from 'react-cookie'
import axios from '../services/customize_axios'
import { URL_public } from "../utils/constant";
import { getSongs,getListendList, getFavList } from "../services/SongServices";
import { getArtistsBycode, getUserInformation } from "../services/UserServices";
export default function Page() {
  const [params] = useSearchParams()
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [songList,setSongList] = useState([])
  const [listendList,setListendList] = useState([])
  const [currentElement,setCurrentElement] = useState(null);
  const handleShowMode = (mode) => setShow(mode);
  const [cookies, setCookie] = useCookies(['access_token'])
  const audioCurrent = useRef(new Audio())
  const [userProfile,setUserProfile] = useState({})
  const [userCode,setUserCode] = useState('')
  const [paramCurrent,setParamCurrent]= useState('')
  const [favList,setFavList] = useState([])
  const [favCodeList,setFavCodeList]= useState([])
  const [artistCodeList,setArtistCodeList]= useState([])
  const [infoArtists,setInfoArtist] = useState([])
  let intial = useRef(false)
  // handle cookie
  const handleCookie =  async(token) => {
    const value = await axios.get(`/users?token=${token}`)
    if(+value.ErrorCode ===0){
      const code = value.data[0].MAND
      await getFavListSong(code)
      await getFavArtistListCode(code)
      await getUserType(code)
      await getListendSong(code)
      setUserCode(code)
      return;
      }
      navigate("/sign")
      window.location.reload()
  }
   //get FavListSong 
   const getFavListSong = async (mand) =>{
    const value = await getFavList(mand)
    const arr = []
    const t = []
    if(+value.ErrorCode ===0)
      {
        value.data.forEach(element => {
          arr.push(element)
          t.push(element.MABH)
        });
        setFavList([...arr])
        setFavCodeList([...t])
        return;
      }
  }
  // get Usertype
  const getUserType = async (mand)=>
    {
        const value = await getUserInformation(mand)
        setUserProfile(value?.data[0])
    }
  // getSongList Method
  const getSongList = async (tenBH)=>{
    let temp = tenBH
    if(!temp)
      temp =''
    const value = await getSongs(temp)
    const arr =[]
    if(+value.ErrorCode ===0)
      {
        value.data.forEach(element => {
          arr.push(element)
        });
        // put curentElement is 0
        if(!intial.current)
          {
            setCurrentElement({...arr[0],idx:0,isPlay:false})
            audioCurrent.current.setAttribute("src",URL_public + arr[0]?.filenhac)
          }
        // flag
        intial.current = true
        // put element into state
        setSongList([...arr])
        return;
      }
      setSongList([...arr])
  }
  // get ListendSong method
  const getListendSong = async (mand)=>{
    const value = await getListendList(mand)
    //console.log(value);
    const arr =[]
    if(+value.ErrorCode ===0)
      {
        value.data.forEach(element => {
          arr.push(element)
        });
        setListendList([...arr])
      }
   
  }
  //get FavArtistListCode Method
  const getFavArtistListCode = async (mand) => {
    const value = await getArtistsBycode(mand)
    const arr =[]
    const t =[]
    if(+value.ErrorCode ===0)
      {
        value.data.forEach(element => {
          arr.push(element.MANS)
          t.push(element)
        });
        setInfoArtist([...t])
        setArtistCodeList([...arr])
      }
  }
  //FetchMyAPI
  const FetchMyAPI = async ()=>{
    const access_cookies = cookies.access_token
    // can get cookies
    await handleCookie(access_cookies)
    await getSongList(params.get("search"))  
  }
  //
  useEffect( ()=>{
    FetchMyAPI()
  },[paramCurrent])
  return (
    <AudioCurrentContext.Provider value={{paramCurrent,infoArtists,artistCodeList,setArtistCodeList,favCodeList,setFavCodeList,params,userProfile,favList,setFavList,setParamCurrent,listendList,setListendList,userCode,songList,currentElement,setCurrentElement,audioCurrent}}>
      <Container fluid className="color_homepage color_page">
        <BarComponnet handleShowMode={handleShowMode} />
        {/* Main*/}
            <Outlet />
      </Container>
      <Musiccontroller />
      {/* Offcanvas trigger */}
      <BarTrigger handleShowMode={handleShowMode} show={show} />
    </AudioCurrentContext.Provider>
  );
}
