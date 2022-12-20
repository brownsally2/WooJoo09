import { useEffect, useState, useRef } from "react";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChattingProduct from "../components/Chattingproduct";
import ChattingProductBuy from "../components/ChattingPoductBuy";
import ChatBuyButton from "../components/ChatBuyButton";
import ChatSellButton from "../components/ChatSellButton";
import api from "../api/api";
import { useLocation, useParams } from 'react-router-dom';
import send1 from "../resources/buluepurple_rocket.png"
import { Link } from "react-router-dom";
import fashion from "../resources/fashion_sample.png";
import "../style/chat.scss"

const ChatPage = () =>{

  let { partner_num } = useParams();
  // {nickname, img_url, chat_time, chat_content, is_read, partner_num}
   const location = useLocation();
   const memberNum = location.state.memberNum;
   const nickname = location.state.list.nickname;
   const acceptTrade = location.state.list.accept_trade;
   const doneTrade = location.state.list.done_trade;
   const product = location.state.list.product;
   const price = location.state.list.price;
   const imgUrl = location.state.list.img_url;
   const host = location.state.list.host;

  const [socketConnected, setSocketConnected] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [rcvMsg, setRcvMsg] = useState("");
  const webSocketUrl = `ws://localhost:9009/ws/chat`;
  // // roomId랑 sender은 받아와야함 -> navigate로 받아오면 될듯
  // const roomId = window.localStorage.getItem("chatRoomId");
  //  const sender = "곰돌이사육사";
   let ws = useRef(null);
   const [items, setItems] = useState([]);

  let roomId = partner_num;
  
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('');
  const [lists, setLists] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [sender, setSender] = useState();

  // const $element = document.querySelecotr("div");
  // $element.scrollTop = $element.scrollHeight;


  useEffect(() => {
    const fetchData = async () => {
     setLoading(true);
      try {
        const response = await api.chatContent(partner_num);
        setLists(response.data[0]);
        // console.log(response.data);
        console.log(response.data[0].chattingContent[0].sender);
        setSender(response.data[0].chattingContent[0].sender);
        // console.log(response.data[0])
        setPrepared(true);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [partner_num]);


  const visibleAccount = (e) => {
    setVisible(!visible);
    // setType(e.target.value)
  }

  // const EntranceBuy  = visible?
    //  <ChattingProductBuy /> :  <ChattingProduct />;


  const onChangMsg = (e) => {
      setInputMsg(e.target.value)
  }

  const onEnterKey = (e) => {
      if(e.key === 'Enter') {
        onClickMsgSend(e);
      }
  }

  const onClickMsgSend = (e) => {
    const fetchData = async () => {
      try {
        console.log(items);
          const res = await api.chatContentInsert(partner_num, inputMsg, "text", memberNum);
          console.log(res.data);
          // window.localStorage.setItem("chatRoomId", res.data);
          // setRoomId(res.data);
          //  window.location.replace("/chat");
        } catch {
            console.log("error");
        }
      };  
    e.preventDefault();
    ws.current.send(
        JSON.stringify({
        "type":"TALK",
        "roomId": roomId,
        "sender": memberNum,
        "message":inputMsg
    }));
    setInputMsg("");
    fetchData();
  }

  const msgInsert = () =>{
    const fetchData = async () => {
      try {
        console.log(items);
          const res = await api.chatContentInsert(partner_num, inputMsg, "text", memberNum);
          console.log(res.data);
          // window.localStorage.setItem("chatRoomId", res.data);
          // setRoomId(res.data);
          //  window.location.replace("/chat");
      } catch {
          console.log("error");
      }
    };
    fetchData();
  } 
  const onClickMsgClose = () => {
      ws.current.send(
          JSON.stringify({
          "type":"CLOSE",
          "roomId": roomId,
          "sender":memberNum,
          "message": "종료 합니다."
        }));
      ws.current.close();
  }

  useEffect(() => {
  //   // 화면이 렌더링 될 때 불러지는것, 자동으로 세션 연결
  //   // 화면이 로딩되자마자 웹소켓을 열어달라고 요청
      setItems([]);
      console.log("방번호 : " + roomId);
      if (!ws.current) {
          ws.current = new WebSocket(webSocketUrl);
          ws.current.onopen = () => {
              console.log("connected to " + webSocketUrl);
          setSocketConnected(true);
          };
      }
      if (socketConnected) {
        // 연결 되면 바로 방으로 진입
          ws.current.send(
              JSON.stringify({
              "type":"ENTER",
              "roomId": roomId,
              "sender": memberNum,
              "message": "처음으로 접속 합니다."
            }));
      }
      ws.current.onmessage = (evt) => {
          const data = JSON.parse(evt.data);
          console.log(data.message);
          setRcvMsg(data.message);
          setItems((prevItems) => [...prevItems, data]);
    };
  }, [roomId]);


      
  return(
    <div className="wrapper">
      <div className="chatLeft"><ChatList/></div>
      <div className="chatRight">
        
      <div className="chatNickname">
        <span>{nickname}</span> 
        {doneTrade == 'ONGOING' && acceptTrade == 'REJECT' && <div className="chatStateWait">대기</div>} 
        {doneTrade == 'ONGOING' && acceptTrade == 'ACCEPT' && <div className="chatStatejoin">참여</div>} 
        {doneTrade == 'DONE' && <div className="chatStatedone">완료</div>}
      </div>

        <div className="chattingProduct">
          <div>
              <Link to="/write">
                <img img src = {imgUrl} alt="물품이미지"/>
              </Link>
                <div className="chatProInfo">
                  <p className="chatProductName">{product}</p>
                  <div className="chatPrice">{price}원</div>
                  

                  {host == memberNum?  <div><button>공구승인</button><button>공구거절</button></div>
                     : <button>공구나가기</button>  }
                    {/* 공구 구매자 */}
                    {/* <button>공구나가기</button> */}
                </div>
          </div>
        </div>
        {/* <ChattingProduct /> */}

        <div className="chatContent">
          {/* <div className="chatDate">2022년 12월 1일</div>
          <div className="chatMessage">상대가 보낸 메시지!!!!!</div>
          <div className="chatTalkTime">19:00</div>
          <div className="chatTalkTime-My">19:12</div>
          <div className="chatMessage-My">내가 보낸 메시지!!!!!!</div> */}

          {prepared &&
          lists.chattingContent.map(({chat_content, chat_time, sender}) => (
          <>
              {memberNum != sender && <div className="chatMessage">{chat_content}</div>}
              {memberNum != sender && <div className="chatTalkTime">{chat_time.substr(11,11)}</div>}
              {memberNum == sender && <div className="chatTalkTime-My">{chat_time.substr(11,11)}</div>}
              {memberNum == sender && <div className="chatMessage-My">{chat_content}</div>}  
               
          </>
          ))} 
               <div>
                {/* .filter((item) => item.type !== "ENTER") */}
                {items.filter((item) => item.type !== "ENTER")
                .map((item) => (
                    <div className={ memberNum != item.sender ? "chatMessage" : "chatMessage-My"}>{`${item.message}`}</div>
                    // <div className="chatMessage-My">{`${item.message}`}</div>
                    ))}
                </div>  
       
              {/* 강사님 웹소켓 채팅 코드
                  <div>
                    <div>socket</div>
                    <div>socket connected : {`${socketConnected}`}</div>
                    <div>방번호: {roomId}</div>
                    <h2>소켓으로 문자 전송하기 테스트</h2>
                    <div>
                        {items.map((item) => {
                        return <div>{`${item.sender} > ${item.message}`}</div>;
                        })}
                    </div>
                    <input className="msg_input" placeholder="문자 전송" value ={inputMsg} onChange={onChangMsg} onKeyUp={onEnterKey}/>
                    <button className="msg_send" onClick={onClickMsgSend}>전송</button>
                    <p/>
                    <button className="msg_close" onClick={onClickMsgClose}>채팅 종료 하기</button>
                  </div> */}
        </div>

          {host == memberNum?  <ChatBuyButton partner_num={partner_num}/> : <ChatSellButton partner_num={partner_num}/> }
        <div className="chatBottom">
          <input className="chatSend" value ={inputMsg} onChange={onChangMsg} onKeyUp={onEnterKey}/>
          <button onClick={ (e) => {onClickMsgSend(e);}}><img src={send1} alt="send"/></button>
          {/* <button className="msg_close" onClick={onClickMsgClose}>채팅 종료 하기</button> */}
        </div>
        
      </div>
    </div>
  )
}
export default ChatPage
