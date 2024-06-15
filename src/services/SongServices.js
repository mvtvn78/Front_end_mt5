import axios from './customize_axios'
const getSongs = (tenBH ='') => {
    return axios.get(`song_details?tenBH=${tenBH}`,{});
}
const increaseView = (maBH) => {
    return axios.put("increase_view",{"maBH" : maBH})
}
const getListendList = (maND)=>{
    
    return axios.get(`listened_list_code?maND=${maND}`,{ });
}
const getFavList = (maND) =>
{
    return axios.get(`favorites_list_code?maND=${maND}`,{})
}
const getSongByAlbs = (maALb) => {
    return axios.get(`song_album_code?MAALB=${maALb}`,{})
}
export {getSongs,increaseView,getListendList,getFavList,getSongByAlbs}