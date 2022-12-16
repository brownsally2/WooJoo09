import React from "react";
import { useState } from "react";
import { logisticsCompanys } from "../util/util";
import "../style/chat.scss"

const SendDelivery = () => {
        
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const [deliveryNum, setdeliveryNum] = useState("");

  const onChangeDeliveryCompany = (e) => {
    setDeliveryCompany(e.target.value);
    console.log(e.target.value);
  }
  const onChangeDeliveryNum = (e) => {
    setdeliveryNum(e.target.value);
  }
 
 

    return(

        <div className="sendDelivery">
          <div>운송장</div>
          <select
            onChange={onChangeDeliveryCompany}
            >
              <option value={""} >택배사 선택</option>
              {logisticsCompanys.map((e) => (
              <option key={e.gisvalue} value={e.logisticsCompany}>
                {e.logisticsCompany}
              </option>
            ))}
          </select>
          {deliveryCompany === "directInput" && <input onChange= {onChangeDeliveryCompany} placeholder={"택배사"} />}
          <input value={deliveryNum} onChange={onChangeDeliveryNum} placeholder={"운송장번호"}/>

          <button>전송</button>
        </div>
    );
};
export default SendDelivery;