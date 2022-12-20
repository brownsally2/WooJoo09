import React from "react";
import { useState } from "react";
import "../style/chat.scss"
import {BankKind} from "../util/util"
import api from "../api/api";

const SendAccount = ({partner_num}) => {
        
    const [bank, setBank] = useState("");
    const [account, setAccount] = useState("");
    const [accountholder, setAccountholder] = useState("");
    console.log(partner_num);


  const onChangeBank = (e) => {
    setBank(e.target.value);
    console.log(e.target.value);
  }
  const onChangeAccount = (e) => {
    setAccount(e.target.value);
  }
  const onChangeAccountholder = (e) => {
    setAccountholder(e.target.value);
  }

  const accountInsert = () =>{
    const fetchData = async () => {
      try {
        console.log();
          const res = await api.accountsend(partner_num, bank, account, accountholder);
          console.log(res.data);
          setBank("");
          setAccount("");
          setAccountholder("");
      } catch {
          console.log("error");
      }
    };
    fetchData();
  } 
    return(

        <div className="sendAccount">
          <div>계좌번호</div>
          <select onChange= {onChangeBank} >
           <option value={""} >은행 선택</option>
              {BankKind.map((e) => (
              <option key={e.bankValue} value={e.bankName}>
                {e.bankName}
              </option>
               ))}
          </select>
          {bank === "directInput" && <input onChange= {onChangeBank} placeholder={"은행"} value={bank} />}
          <input value={account} onChange={onChangeAccount} placeholder={"계좌"}/>
          <input value={accountholder} onChange={onChangeAccountholder} placeholder={"예금주"}/>
          <button onClick={accountInsert}>전송</button>
        </div>
    );
};
export default SendAccount;