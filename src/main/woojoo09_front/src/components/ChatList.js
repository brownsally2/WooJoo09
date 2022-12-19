
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
  const [partnerNum, setPartnerNum] = useState('');
  const [memberNum, setMemberNum] = useState('');
  const [nickname, setNickname] = useState('');
  const [aceeptTrade, setAceeptTrade] = useState('');
  const [doneTrade, setDoneTrade] = useState('');
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
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


  const move = (list) => {
    // 두번재 인자의 state 속성에 원하는 파라미터를 넣어준다. (id, job을 넣어봤다)
   // eslint-disable-next-line no-lone-blocks
   {navigate(`/chat/${list.partner_num}`, {
      state: {
        // memberNum: memberNum,
        // nickname : nickname,
        // aceeptTrade : aceeptTrade,
        // doneTrade : doneTrade,
        // product : product,
        // price : price
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
              {/* <Link to={{
                    pathname: `/chat/${partner_num}`,
                    state: {
                      // memberNum : memberNum,
                      nickname : nickname,
                      aceeptTrade : aceept_trade,
                      doneTrade : done_trade,
                      product : product,
                      price : price
                    },
                  }}
                > */}
                {/* <Link to={`/chat/${partner_num}`} state={ memberNum : memberNum, }> */}
                    <p onClick={()=>{chatTest(list.partner_num); move(list);}}>
                      <span><img src = {list.img_url} alt="물품이미지"/></span>
                      <p className="chatDetailNick">{list.nickname}</p>
                      <p className="chatTime">{list.chat_time.substr(0,11)}</p>
                      <div>{list.chat_content}</div>
                      {list.is_read === "UNREAD" && <p className="chatAlert"/>}
                    </p>
                  {/* </Link>     */}
                </div>
               </div>
              ))}
    </div>
  );
}
export default ChatList