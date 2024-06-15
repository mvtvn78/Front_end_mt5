import React, { useContext } from "react";

import "../css/ItemAlbumComponnent.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faCirclePlay, faCirclePause } from '@fortawesome/free-solid-svg-icons';
import { URL_public } from "../utils/constant";
import { AudioCurrentContext } from "../context/AudioCurrentContext";
import { getListendList, increaseView } from "../services/SongServices";
import { CheckListendSong, UpdateTimeListendSong, addListendSong } from "../services/UserServices";
export default function ItemAlbumComponnet({idx,info,tenNS}) {
  //using context
  const {currentElement,setListendList,userCode,setCurrentElement,audioCurrent} = useContext(AudioCurrentContext);
  //IncreaseView Handler
  const putIncreaseView = async (maBH) =>
    {
      const value = await  increaseView(maBH)
      if(+value.ErrorCode !==0)
          window.location.reload()
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
  //Function to play
  const MusicManager = (e) => {
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
    //load and set src
    audioCurrent.current.load()
    audioCurrent.current.setAttribute('src',URL_public + info.filenhac);
    audioCurrent.current.play()
    setCurrentElement({...info,idx: -1,isPlay:true})
  }
  return (
    <tr >
      <td>{idx+1}</td>
      <td className="place_img">
        <div className="ablums_it">
          <div className="ablums_it_head">
            <img src={URL_public + info?.AnhBH} alt="" />
            <FontAwesomeIcon icon={faCirclePlay} data_mabh={info?.MABH}  onClick={MusicManager} className='ablum_it_btn'/>
          </div>
          <div className="ablums_it_content">
            <h3 className="text_out">{info?.TenBH}</h3>
            <p className="text_normal">{tenNS}</p>
          </div>
        </div>
      </td>
      <td>
        {new Date(info?.ThoiGian).toLocaleString()}
      </td>
      <td>2:33</td>
    </tr>
  );
}
