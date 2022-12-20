import React from "react";
import { useState } from "react";
import { logisticsCompanys } from "../util/util";
import "../style/chat.scss"
import api from "../api/api";

const SendDelivery = ( {partner_num} ) => {
        
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const [deliveryNum, setdeliveryNum] = useState("");
  const [Selected, setSelected] = useState("");
  // console.log(partner_num);

  const onChangeDeliveryCompany = (e) => {
    setDeliveryCompany(e.target.value);
    console.log(e.target.value);
  }
  const onChangeDeliveryNum = (e) => {
    setdeliveryNum(e.target.value);
  }
   const deliveryInsert = () =>{
    const fetchData = async () => {
      try {
        console.log();
          const res = await api.deliverysend(partner_num, deliveryCompany, deliveryNum);
          console.log(res.data);
          setDeliveryCompany("");
          setdeliveryNum("");
      } catch {
          console.log("error");
      }
    };
    fetchData();
  } 
 

    return(
        //value={""} 
        <div className="sendDelivery">
          <div>운송장</div>
          <select
            onChange={onChangeDeliveryCompany}
            >
              <option value={Selected} >택배사 선택</option>
              {logisticsCompanys.map((e) => (
              <option key={e.gisvalue} value={e.logisticsCompany}>
                {e.logisticsCompany}
              </option>
            ))}
          </select>
          {deliveryCompany === "directInput" && <input onChange= {onChangeDeliveryCompany} placeholder={"택배사"} value={deliveryCompany} />}
          <input value={deliveryNum} onChange={onChangeDeliveryNum} placeholder={"운송장번호"}/>

          <button onClick={deliveryInsert}>전송</button>
        </div>
    );
};
export default SendDelivery;