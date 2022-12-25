import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const KakaoLogin = () => {
    // const navigate = useNavigate();

    // useEffect(async () => {
    //     const getAccessToken = async authorizationCode => {
    //         let toKenData = await axios
    //         .post('http://localhost:9009/developerkirby/kakao', {
    //             authorizationCode,
    //         })
    //         .then(res => {
    //             let accessToken = res.data
    //             localStorage.setItem('AC_Token', accessToken)
    //             navigate('/main')
    //         })
    //     }
    //     const url = new URL(window.location.href)
    //     const authorizationCode = url.searchParams.get('code')
    //     if(authorizationCode) {
    //         await getAccessToken(authorizationCode)
    //     }
    // }, [])

}

export default KakaoLogin;