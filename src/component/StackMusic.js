import React, { useContext, useEffect, useState } from 'react'
import Stack from 'react-bootstrap/Stack';
import ItemMusic from "./ItemMusic";
import "../css/StackMusic.css"
import { AudioCurrentContext } from '../context/AudioCurrentContext';
import NotFound from './NotFound';
export default function StackMusic({list}) {
  // use context
  const {songList} = useContext(AudioCurrentContext);
  return (
    <Stack gap={5}  className='stack_music p-2' >
      {window.location.pathname=='/profile' && list?.length ===0 ? <NotFound content={'Danh sách yêu thích rỗng,bạn có thể bỏ nhạc mình thích vào danh sách này.Quay về trang chủ để thêm ngay nhé!'}/> :''}
      {window.location.pathname=='/profile' && list?.map((el,idx) => <ItemMusic key={idx}  idx={idx} info={el} />)}
      {window.location.pathname=='/' && songList?.length ===0 ? <NotFound content={`Không tìm thấy kết quả của bạn,Vui lòng về trang chủ ngay phía dưới`}/> :''}
      {window.location.pathname=='/' && songList?.map((el,idx) => <ItemMusic key={idx}  idx={idx} info={el} />)}
    </Stack>
  )
}
