
import { useState,  useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import fashion from "../resources/fashion_sample.png";
import "../style/chat.scss"
import "../style/common.scss"
import api from "../api/api"

const ChatList = () =>{

  const [seller, setSeller] = useState('');
  const [lists, setLists] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [memberNum, setMemberNum] = useState();
  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
     setLoading(true);
      try {
        const response = await api.chatList();
        setLists(response.data[0]);
        setMemberNum(response.data[1])
        console.log(response.data);
        console.log(response.data[0].chatListContent);
        // console.log(response.data[0].chatListContent[0].partner_num);
        // setPartnerNum(response.data[0].chatListContent[0].partner_num)
        setPrepared(true);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);


  const chatTest = (partnerNum) =>{
    const fetchData = async () => {
      try {
        console.log("partnerNum : " + partnerNum);
          const res = await api.chatRoomOpen(partnerNum);
          console.log("res.data" + res.data);
          // window.localStorage.setItem("chatRoomId", res.data);
          // setRoomId(res.data);
          //  window.location.replace("/chat");
      } catch {
          console.log("error");
      }
    };
    fetchData();
  } 

  return(
    <div className="wrapperLeft">
            <div className="chatList">
                채팅목록
            </div>
            { prepared && 
            lists.chatListContent.map(({nickname, img_url, chat_time, chat_content, is_read, partner_num, sender }) => (

            <div className="chatDetail"> 
            
              <div className="chatButton">
                <Link to={`/chat/${partner_num}`} state={{memberNum : memberNum}}>
                    <p onClick={()=>{chatTest(partner_num)}}>
                      <span><img src = {img_url} alt="물품이미지"/></span>
                      <p className="chatDetailNick">{nickname}</p>
                      <p className="chatTime">{chat_time.substr(0,11)}</p>
                      <div className="chatRecent">{chat_content}</div>
                      {is_read === "UNREAD" && <p className="chatAlert"/>}
                    </p>
                  </Link>    
                </div>
               </div>
              ))}
    </div>
  );
}
export default ChatList