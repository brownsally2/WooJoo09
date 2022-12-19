import Footer from "../components/Footer";
import Header from "../components/Header";
import MemberInfo from "../components/MemberInfo"
import "../style/member.scss"
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const MemberPage = () =>{

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberNum, setMemberNum] = useState();
  const changeIsLogin = (value) => {
    setIsLogin(value);
  };
  const changeIsAdmin = (value) => {
    setIsAdmin(value);
  };

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.tokencheck();
        if(response.data.result === "OK"){
          setIsLogin(true);
          setMemberNum(response.data.memberNum);
        } else{
          setIsLogin(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  if (!isLogin){
    navigate("/login", {state : "유효하지 않은 접근입니다\n로그인 후 이용해 주세요"});
  } 


  return(
    <div className="memberinfowrapper">
      <Header
      isLogin={isLogin} 
      changeIsLogin={changeIsLogin}
      isAdmin={isAdmin}
      changeIsAdmin={changeIsAdmin}/>
      <MemberInfo
      memberNum = {memberNum} />
      <Footer/>
    </div>
  );
  // }
}
export default MemberPage