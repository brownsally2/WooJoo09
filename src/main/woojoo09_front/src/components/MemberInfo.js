import { useState, useEffect } from "react";
import "../style/member.scss"
import "../style/common.scss"
import ChangeMemberInfo from "./ChangeMemberInfo";
import MyTrade from "./MyTrade";
import api from "../api/api";
import MemberInfoList from "./MemeberInfoList";


const MemberInfo = ({memberNum, memberInfo, changeIsChange}) =>{

  
    return(
      <div className="memberinfomain">
        <MemberInfoList memberInfo={memberInfo}/>
        <div className="memberinfocenter">
          <ChangeMemberInfo 
          changeIsChange={changeIsChange}
          memberNum={memberNum} 
          memberInfo={memberInfo}/>
          <MyTrade memberInfo={memberInfo}/>
          <div className="unReg">회원 탈퇴</div>
        </div>
      </div>
    )
  }
  export default MemberInfo;