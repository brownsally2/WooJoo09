
import { useState,  useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import fashion from "../resources/fashion_sample.png";
import "../style/chat.scss"
import "../style/common.scss"
import api from "../api/api"
import ChatListTime from "./ChatListTime";

const ChatList = () =>{

  const [seller, setSeller] = useState('');
  const [lists, setLists] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [partnerNum, setPartnerNum] = useState('');
  const [memberNum, setMemberNum] = useState('');
  // const [nickname, setNickname] = useState('');
  // const [aceeptTrade, setAceeptTrade] = useState('');
  // const [doneTrade, setDoneTrade] = useState('');
  // const [product, setProduct] = useState('');
  const [chatTime, setChatTime] = useState('');
  const navigate = useNavigate();
  // const now = new Date();	
  // console.log(now);

  const kr = 9 * 60 * 60 * 1000
  
  

  useEffect(() => {
    const fetchData = async () => {
     setLoading(true);
      try {
        const response = await api.chatList();
        setLists(response.data[0]);
        setMemberNum(response.data[1])
        // console.log(response.data[0]);
        // console.log(response.data[0].chatListContent);
        // console.log(response.data[0].chatListContent[0].chat_time);
        // console.log(response.data[0].chatListContent[0].partner_num);
        // let chatContent = lists.chat_content;
        // console.log(chatContent);
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
      } catch {
          console.log("error");
      }
    };
    fetchData();
  } 


  const move = (list) => {
    // 두번재 인자의 state 속성에 원하는 파라미터를 넣어준다. 
   // eslint-disable-next-line no-lone-blocks
   {navigate(`/chat/${list.partner_num}`, {
      state: {
        list : list,
        memberNum : memberNum
      }
    });
  }
  };


  return(
    <div className="wrapperLeft">
            <div className="chatList">
                채팅목록
            </div>
            { prepared && 
            lists.chatListContent.map((list) => (

            <div className="chatDetail"> 
            
              <div className="chatButton">
                    <p onClick={()=>{chatTest(list.partner_num); move(list);}}>
                      <span><img src = {list.img_url} alt="물품이미지"/></span>
                      <p className="chatDetailNick">{list.nickname}</p>
                      <p className="chatTime">{list.chat_time +kr}</p>
                      <div>{list.chat_content}</div>
                      {list.is_read === "UNREAD" && <p className="chatAlert"/>}
                    </p>
                </div>
               </div>
              ))}
    </div>
  );
}
export default ChatList