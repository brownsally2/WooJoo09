
import { useState } from "react";
import SendAccount from "./ChatSendAccount";
import SendDelivery from "./ChatSendDelivery"
import SendPhoto from "./ChatSendPhoto";
const ChatSellButton = () => {
    const [visible, setVisible] = useState(false);
    const [visibleDel, setVisibleDel] = useState(false);
    const [visiblePho, setVisiblePho] = useState(false);
    const [type, setType] = useState('');

    const visibleAccount = (e) => {
        // console.log("선택한 값 : " +e.target.value)
        setVisible(!visible);
        setVisibleDel(false);
        setVisiblePho(false);
        setType(e.target.value)
    }
        // console.log("값이 있나요?" +type);
    const visibleDelivery = (e) => {
        setVisibleDel(!visibleDel);
        setVisible(false);
        setVisiblePho(false);

    }
    const visiblePhoto = (e) => {
        setVisiblePho(!visiblePho);
        setVisible(false);
        setVisibleDel(false);
    }

    return(
        <>
        <div className="sendPrivacy">
            { visible && <SendAccount /> }
            { visibleDel && <SendDelivery /> }
            { visiblePho && <SendPhoto />}
        </div>

        <div className="chatSell">
            <button onClick={visiblePhoto}>{visiblePho ? "숨기기" : "사진전송"}</button>
            <button onClick={visibleAccount} value="bank">{visible ? "숨기기" : "계좌전달"}</button>
            <button>배송조회</button>
            <button onClick={visibleDelivery}>{visibleDel ? "숨기기" : "운송장 전송"}</button>
        </div>
     </>
    );
}
export default ChatSellButton;