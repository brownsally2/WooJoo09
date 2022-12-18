import { useState, useEffect } from "react";
import api from "../../adminApi";
import Loader from "../../components/Loader";
import TopBar from "../../components/TopBar";
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import Sidebar from "../../components/SideBar";

const CategoryManagementAdd = () =>{

  let { board } = useParams();

  const [lists, setLists] = useState('');
  const [loading, setLoading] = useState(false);
  const [newBoardName, setNewBoardName] = useState(board);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
     setLoading(true);
     window.localStorage.setItem("target", board);
      try {
        const response = await api.boardInfoDetail();
        setLists(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  
  if(loading) {
    return <div className="center"><Loader/></div>
  }
  
  const onChangeBoard = (e) =>{
    const tmpName = e.target.value;
    setNewBoardName(tmpName);
    if(tmpName === "관리자") setErrMsg("게시판 이름으로 '관리자'는 사용 불가능합니다");
  }

  const boardNameDup = () =>{
    const fetchSearchData = async () => {
      setLoading(true);
       try {
        console.log(newBoardName);
        const response = await api.boardNameDup(newBoardName);
        console.log(response.data.result);
        if(response.data.result === "OK") {
          setErrMsg("사용 가능한 게시판 이름입니다");
          const fetchUpdateData = async () => {
            try {
              const response = await api.boardInsert(newBoardName);
              if(response.data.result === "OK") {
                // console.log("게시판 이름 수정 완료")
                // 나중에 수정 완료 모달 띄우던가,,
                window.location.replace("/ilovekirby/content/categoryManagement");}
            } catch (e) {
              console.log(e);
            }
          };
          fetchUpdateData();
        } else setErrMsg("이미 존재하는 게시판 이름입니다");
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchSearchData();
  }

    return(
      <div className="adminWrapper">
        <Header/>
        <Sidebar/>
      <div className="center">
        <TopBar name="게시판 추가" high1="게시판 관리" high2="콘텐츠 관리"/>
        <div>
          <input type="text" value={newBoardName} onChange={onChangeBoard}/>
          <p>{errMsg}</p>
          <button onClick={boardNameDup}>추가</button>
        </div>
      </div>
      </div>
    );
};
export default CategoryManagementAdd;