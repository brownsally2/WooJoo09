
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
  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
     setLoading(true);
      try {
        const response = await api.chatList();
        setLists(response.data[0]);
        // console.log(response.data);
        console.log(response.data[0]);
        // console.log(response.data[0].partner_num);
        setPrepared(true);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const chatTest = async() => {
    try {
        const res = await api.chatRoomOpen("테스트 채팅방");
        console.log(res.data);
        setRoomId(res.data);
        // window.location.replace("/Socket");
    } catch {
        console.log("error");
    }
}




  //   const move = () => {
  //   // 두번재 인자의 state 속성에 원하는 파라미터를 넣어준다. (id, job을 넣어봤다)
  //  // eslint-disable-next-line no-lone-blocks
  //  {navigate(`/chat`, {
  //     state: {
  //       roomId : roomId,
  //       // memberNum : lists.data[0].chatListContent.member_num
  //     }
  //   });
  // }
  // };

  return(
    <div className="wrapperLeft">
            <div className="chatList">
                채팅목록
            </div>
            { prepared && 
            lists.chatListContent.map(({member_num, nickname, img_url, chat_time, chat_content, is_read, partner_num, sender }) => (

            <div className="chatDetail"> 
            
              <div className="chatButton">
                 <Link to={`/chat/${partner_num}`} state={{memberNum : member_num}}>
                    
                    <p onClick={chatTest}>
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