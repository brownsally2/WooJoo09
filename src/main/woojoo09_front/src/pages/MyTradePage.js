import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer"
import "../style/common.scss"
import "../style/member.scss"
import MemberInfoList from "../components/MemeberInfoList";
import fashionImg from "../resources/fashion_sample.png"
import angel from "../resources/angel_gray4.png"
import angel_lemon from "../resources/angel_lemon.png"
import angel_yellow from "../resources/angel_yellow.png"
import devil from "../resources/devil_gray4.png"
import devil_pink from "../resources/devil_pink.png"
import devil_red from "../resources/devil_red.png"
import {useLocation} from 'react-router-dom';



const MyTradePage =() =>{

    const [isLogin, setIsLogin] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const changeIsLogin = (value) => {
        setIsLogin(value);
    };
    const changeIsAdmin = (value) => {
        setIsAdmin(value);
    };


    const location = useLocation();
    const name = location.state.name;
    const value = location.state.value;

    const [changeGood, setChangeGood] = useState(false);
    const [changeDislike, setChangeDislike] = useState(false);

        return(
        <div>
            <Header
            isLogin={isLogin} 
            changeIsLogin={changeIsLogin}
            isAdmin={isAdmin}
            changeIsAdmin={changeIsAdmin}/>  
            <div className="memberinfomain">
            <MemberInfoList/>
                <div className="memberinfocenter">
                    <div className="MyTradeWrapper"> 
                        <p>{name}</p>

                        <div className="MyTradePos">
                            <p className="MyTradeImg">
                                <img src={fashionImg} alt="패션 예시"/>
                            </p>
                            <p>상품이름</p>
                            <p>공구 남은기한</p>
                            {value === "myDoneTrade" &&
                            <>
                                <div className="MyTradeGood" onClick={()=> {setChangeGood(true)}}>
                                    <img src={angel} alt="기본 좋아요" className="MyTradeImg"/>
                                    <img src={angel_lemon} alt="hover시 좋아요" className="MyTradeImg2"/>
                                    {!changeDislike && changeGood && <img src={angel_yellow} alt="좋아요 누름" className="MyTradeImg3"/>}
                                </div>
                                <div className="MyTradeDislike" onClick={()=> {setChangeDislike(true)}}>
                                    <img src={devil} alt="기본 싫어요" className="MyTradeImg"/>
                                    <img src={devil_pink} alt="hover시 싫어요" className="MyTradeImg2"/>
                                    {!changeGood&& changeDislike &&<img src={devil_red} alt="싫어요 누름" className="MyTradeImg3"/>}
                                </div>
                            </>
                            }
                            {value === "myHostTrade" &&
                            <div className="MyTradeGood">
                                <button>거래 완료하기</button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
export default MyTradePage;