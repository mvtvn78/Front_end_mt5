import React, { useContext, useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, ButtonGroup, Form, Stack } from "react-bootstrap";
import "../css/AlbumComponent.css";
import ItemAlbumComponnet from "./ItemAlbumComponnet";
import { getArtistAlbumByCode } from "../services/ArtistServices";
import { AudioCurrentContext } from "../context/AudioCurrentContext";
import { getSongByAlbs } from "../services/SongServices";
import NotFound from "./NotFound";
import { URL_public } from "../utils/constant";
export default function AlbumComponent({ code, TenNS,parent }) {
  const [listSong, setListSong] = useState([]);
  //
  const FetchAPIAlbum = async () => {
    const value = await getArtistAlbumByCode(code);
    if (+value.ErrorCode === 0) {
      const arr = [...value.data];
      for (let i = 0; i < arr.length; ++i) {
        const songs = await getSongByAlbs(arr[i]?.MAALB);
        arr[i].songs = [...songs.data];
      }
      //console.log(arr);
      setListSong([...arr]);
    }
  };
  //
  useEffect(() => {
    FetchAPIAlbum();
  }, [parent]);
  return (
    <>
      {listSong?.length === 0 ? <NotFound /> : ""}
      {listSong.map((el, idx) => {
        return (
          <Row key={idx}>
            <Col className="album_head" xs={4} >
              <div className="album_img">
                <img src={URL_public + el?.HinhAnh} alt="" />
              </div>
            </Col>
            <Col className="album_content" xs={8}>
              <h3 className="text_out">{el?.TenALB}</h3>
              <p className="text_normal">
               {el?.MoTa}
              </p>
            </Col>
            {/* Album Item */}
            <Col xs={12} className="album_container my-5 p-2" key={idx}>
              <Table striped bordered hover className="table_album">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tiêu đề</th>
                    <th>Ngày phát hành</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {el.songs?.length === 0 ? <NotFound /> : ""}
                  {el.songs?.map((el, idx) => (
                    <ItemAlbumComponnet
                      key={idx}
                      idx={idx}
                      info={el}
                      tenNS={TenNS}
                    />
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        );
      })}
    </>
  );
}
