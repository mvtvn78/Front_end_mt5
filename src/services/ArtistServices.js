import axios from './customize_axios'
const getArtistAlbumByCode = (code)=>{
    return axios.get(`release_album_code?id=${code}`,{})
}
const getArtistByCode = (code) => {
    return axios.get(`artists?id=${code}`,{})
}
export {getArtistAlbumByCode,getArtistByCode}