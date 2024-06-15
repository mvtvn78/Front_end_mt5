import axios from './customize_axios'
const addListendSong = (maBH,maND) => {
    return axios.post("listened_list_add",{"maBH":maBH,"maND":maND})
}
const CheckListendSong = (maBH,maND) => {
    return axios.get(`listened_list?user=${maND}&&bh=${maBH}`,{})
}
const addFavSong = (maBH,maND) => {
    return axios.post("favorites_list_add",{"maBH":maBH,"maND":maND})
}
const RemoveFavSong =(maBH,maND) =>{
    return axios.delete("favorites_list_remove",{data:{"maBH":maBH,"maND":maND}})
}
const addFollowArtist = (maNS,maND)=>{
    return axios.post('followers_add',{"maNS":maNS,"maND":maND})
}
const removeFollowArtist = (maNS,maND)=>{
    return axios.delete('followers_remove',{data:{"maNS":maNS,"maND":maND}})
}
const UpdateTimeListendSong = (maBH,maND) => {
    return axios.put(`listened_list_time`,{"maBH":maBH,"maND":maND})
}
const getUserInformation = (id)=>
{
    return axios.get(`usertypes?id=${id}`,{})
}
const getArtistsBycode = (id)=>{
    return axios.get(`followers_list_code?maND=${id}`,{})
}
const UpdateInfoUser = (mand,maloai,maqt,hoten,gt,ns,email,pass,anh)=>{
    return axios.put(`user_update`,{
        "maND":mand,
        "maLoai":maloai,
        "maQT":maqt,
        "hoTen":hoten   ,
        "gioiTinh":gt,
        "ngaySinh":ns,
        "email":email,
        "pass":pass,
        "Anh":anh,
    })
}
// Chuyển đổi dữ liệu để hiển thị 
function ConvertDate(date)
{
    const datearray = date.split("/");
    for(let indx in datearray)
        if(datearray[indx]<10)
            datearray[indx] = "0"+datearray[indx]
    return datearray[2] + '-' + datearray[1] + '-' + datearray[0];
}
export {UpdateInfoUser,ConvertDate,addListendSong,CheckListendSong,UpdateTimeListendSong,getUserInformation,addFavSong,RemoveFavSong,addFollowArtist,removeFollowArtist,getArtistsBycode}