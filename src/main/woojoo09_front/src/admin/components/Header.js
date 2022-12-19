import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../resources/logo.png"

const Header = () =>{ 
  // 로그인하는 통신 필요 -> 메인처럼
  const [isLogin, setIsLogin] = useState(true);

  return(
    <div className="adminheader">
      <Link to={'/'} className="logo">
      <img src={logo} alt="우주공구"/>
      {/* <span className="title">우주공구</span> */}
      </Link>
      {isLogin && 
        <p className="headerMenu">
          <span>관리자(ADMIN)</span>
          {/* 로그아웃 기능 만들어야함 */}
          <button>로그아웃</button>
        </p>
      }
    </div>
  );
};

export default Header;