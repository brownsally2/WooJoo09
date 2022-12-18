import React, { useState, useEffect } from "react";
import api from "../../adminApi";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import Sidebar from "../../components/SideBar";
import TopBar from "../../components/TopBar";

const NotiSend = () =>{
  const [lists, setLists] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState(false);

  const [mail,setMail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [disabled, setDisabled] = useState(true);
  

  const onChangeTitle = (e) =>{
    setTitle(e.target.value);
  } 
  const onChangeContent = (e) => {
    setContent(e.target.value);
  } 

  // 체크된 아이템을 담을 배열
  const [checkItems, setCheckItems] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //    setLoading(true);
  //     try {
  //       const response = await api.memberInfo();
  //       setLists(response.data);
  //       setPrepared(true);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, []);

  // if(!isLogin){
  //   alert("잘못된 접근입니다!");
  //   window.location.replace("/");
  // }
  
  // if(loading) {
  //   return <div className="center"><Loader/></div>
  // }


  const adminNotiSend = () => {
    setPrepared(false);
    const fetchDeleteData = async () => {
      setLoading(true);
       try {
         const response = await api.adminNotiSend(mail, title, content);
         setLists(response.data);
         console.log(response.data);
         setPrepared(true);
       } catch (e) {
         console.log(e);
       }
       setLoading(false);
       alert("발송이 완료되었습니다!!!!!!!");
       window.location.replace("/");
     };
    fetchDeleteData();
    setCheckItems([]);
    }
  
  if(loading) {
    return <div className="center"><Loader/></div>
  }

  const handleClickRadioButton = (e) => {
    console.log("선택한 값 : " + e.target.value);
    setMail(e.target.value);
    setDisabled(false);
  }
  

return(
  <div className="adminWrapper">
    <Header/>
    <Sidebar/>
  <div className="center">
    <TopBar name="알림 발송" high1="알림 관리"/>
    <label>
      <span>알림 분류</span>
      <div>
      <label><input type="radio" name="notisend" onChange={handleClickRadioButton} value="notice" />공지사항</label>
      <label><input type="radio" name="notisend" onChange={handleClickRadioButton} value="ad"/>광고</label>
      </div>
    </label>
    <br/>
      <label>
        <span>제목</span>
        <input type="text" value={title} onChange={onChangeTitle}/>
      </label>
      <br/>
      <label>
        <span>내용</span>
        <textarea value={content} onChange={onChangeContent}/>
      </label>
      <br/>
      <button onClick={adminNotiSend} disabled ={disabled} >발송</button>
    </div>
    </div>
  );
};
export default NotiSend;