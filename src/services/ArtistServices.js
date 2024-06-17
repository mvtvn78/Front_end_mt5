import axios from './customize_axios'
const getArtistAlbumByCode = (code)=>{
    return axios.get(`release_album_code?id=${code}`,{})
}
const getArtistByCode = (code) => {
    return axios.get(`artists?id=${code}`,{})
}
const getNumberFollowerCode = (code)=>{
    return axios.get(`followers_total_artist?maNS=${code}`,{})
}
const getNumberSongsCode = (code)=>{
    return axios.get(`release_total_artist?maNS=${code}`,{})
}
export {getArtistAlbumByCode,getArtistByCode,getNumberFollowerCode,getNumberSongsCode}