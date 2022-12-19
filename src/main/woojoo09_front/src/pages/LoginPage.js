import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

const LoginPage = () =>{
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');

  //에러메시지
  const [loginIdOkMsg, setLoginIdOkMsg] = useState('');
  const [loginIdMsg, setLoginIdMsg] = useState('');

  const [loginPwdOkMsg, setLoginPwdOkMsg] = useState('');
  const [loginPwdMsg, setLoginPwdMsg] = useState('');

  //유효성 검사
  const [isLoginId, setIsLoginId] = useState(false);
  const [isLoginPwd, setIsLoginPwd] = useState(false);

  //정규식
  const idRegEx = /^[A-za-z0-9]{3,15}$/g;
  const pwdRegEx = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,20}$/;

  const onChangeLoginId = (e) => {
    const loginInputId = e.target.value;
    setLoginId(loginInputId);
    
    if(!idRegEx.test(loginInputId)) {
      setIsLoginId(false);
      setLoginIdMsg("3~15자리 영문자 또는 숫자를 입력해주세요.");
    } else {
      setIsLoginId(true);
      setLoginIdOkMsg("");
    }
  }

  const onChangeLoginPwd = (e) => {
    const loginInputPwd = e.target.value;
    setLoginPwd(loginInputPwd);

    if(!pwdRegEx.test(loginInputPwd)) {
      setIsLoginPwd(false);
      setLoginPwdMsg("8~20자리 소문자, 숫자, 특수문자를 입력해주세요.");
    } else {
      setIsLoginPwd(true);
      setLoginPwdOkMsg("");
    }
  }

  const onClickGoToTermAgree = () => {
    navigate("/termagree");
  }

  //로그인 버튼
  const onClickLogin = () => {
     const loginFetchDate = async () => {
      try {
        const response = await api.loginData(loginId, loginPwd);
        if(response.data === true) {
          navigate('/main')
        } else {
          setIsLoginPwd(false);
          setLoginPwdMsg("아이디와 비밀번호가 일치하지 않습니다.")
        }
      }catch (e) {
        console.log(e)
      }
     }
     loginFetchDate();
  }

  
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [])


  return(
    <div className="wrapper">
      <Header/>
      <div className="loginWrapper">     
        <div className="login">
          <h2>로그인</h2>
          <p style={{color: "red", whiteSpace: "pre-line", textAlign: "center"}}>{state}</p>
          <div className="loginMain">
            <div className="loginSmallBox">
              <input type="text" value={loginId} className="loginInput" placeholder="아이디"
              onChange={onChangeLoginId}></input>
            </div>
            <div className="loginErrMsg">
              {!isLoginId && <span className="loginIdErr">{loginIdMsg}</span>}
              {isLoginId && <span className="loginIdOk">{loginIdOkMsg}</span>}
            </div>
            <div className="loginSmallBox">
              <input type="password" value={loginPwd} className="pwdInput" placeholder="비밀번호"
              onChange={onChangeLoginPwd}></input>
            </div>
            <div className="loginErrMsg">
              {!isLoginPwd && <span className="loginIdErr">{loginPwdMsg}</span>}
              {isLoginPwd && <span className="loginIdOk">{loginPwdOkMsg}</span>}
            </div>   
            <div className="IdPwdSearchButtonBox"> 
            <Link to="/findid" className="IdPwdSearchButton">아이디 찾기</Link>
            <Link to="/findpwd" className="IdPwdSearchButton">비밀번호 찾기</Link>            
            </div>
              <button className="loginButton" onClick={onClickLogin}>로그인하기</button>           
            <div>
              <button className="RegButton" onClick={onClickGoToTermAgree}>회원가입</button>
            </div>
            <div className="kakaoLogin">         
              {/* <button className="kakaoLogin"><img src="../resources/kakao_login_medium_wide.png" /></button> */}
              <input type="button" className="kakaoLoginBut"></input>
            </div> 
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
export default LoginPage