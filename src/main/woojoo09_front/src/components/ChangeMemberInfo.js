import { useState, useEffect } from "react";
import { storage } from "../api/firebase"
import { Link } from "react-router-dom";
import api from "../api/api";

const ChangeMemberInfo = (props) =>{
  const memberNum = props.memberNum;

  const [changeNickname, setChangeNickname] = useState(false);
  const [changeProfileImg, setChangeProfileImg] = useState(false);
  const [changePwd, setChangePwd] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changeReceiveAd, setChangeReceiveAd] = useState(false);

  const [inputPwd1, setInputPwd1] = useState('');
  const [inputPwd2, setInputPwd2] = useState('');
  const [inputPwd3, setInputPwd3] = useState('');


  const [disabled, setDisabled] = useState(true);


  //오류메시지
  const [pwMessage, setPwMessage] = useState("");
  const [conPwMessage, setConPwMessage] = useState("");
  const [conPwMessage2, setConPwMessage2] = useState("");

  // 유효성 검사
  const [isPw, setIsPw] = useState(false)
  const [isConPw, setIsConPw] = useState(false);

  //오류메시지
  const [emailMessage, setEmailMessage] = useState("");




  //닉네임 관련
  const nickRegEx = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{1,15}$/;
  const [infoNewNickInput, setInfoNewNickInput] = useState('');
  const [infoNewNickMsg, setInfoNewNickMsg] = useState("");
  const [infoNewNickOkMsg, setInfoNewNickOkMsg] = useState("");
  const [isInfoNewNick, setIsInfoNewNick] = useState(false);
  const [isInfoNewNickCk, setIsInfoNewNickCk] = useState(false);

  //이메일 관련
  const [inputEmail, setInputEmail] = useState('');
  const [isEmail, setIsEmail] = useState(false)

  //광고수신여부 관련
  const [infoAd, setInfoAd] = useState('');
  const [isInfoAd, setIsInfoAd] = useState(false);
  const [infoAdOkMsg, setInfoAdOkMsg] = useState('');
  const [infoAdErrMsg, setInfoAdErrMsg] = useState('');

  //프로필 이미지 관련
  let cnt = 0;
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  //주최자 소개 관련
  const [inputIntroduce, setInputIntroduce] = useState(props.memberInfo.introduce);
  const [isInfoIntroduce, setIsInfoIntroduce] = useState(false);
  const [infoIntroduceOkMsg, setInfoIntroduceOkMsg] = useState('');
  const [infoIntroduceErrMsg, setInfoIntroduceErrMsg] = useState('');
  const [changeHost,setChangeHost] = useState(false);


  const handleImage = (event) => {
    const image = event.target.files[0];
    setImage(image);
    console.log(image);
    setError("");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (image === "") {
      console.log("파일이 선택되지 않았습니다");
      setError("파일이 선택되지 않았습니다");
      return;
    }
    // 업로드 처리
    console.log("업로드 처리");
    const storageRef = storage.ref("images/profile/"); //어떤 폴더 아래에 넣을지 설정
    const imgName = (memberNum + "_pfImg");
    const imagesRef = storageRef.child(imgName);
    // const imagesRef = storageRef.child(image.name); //파일명

    console.log("파일을 업로드하는 행위");
    const upLoadTask = imagesRef.put(image);
    console.log("태스크 실행 전");

    upLoadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("snapshot", snapshot);
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(percent + "% done");
      },
      (error) => {
        console.log("err", error);
        setError("파일 업로드에 실패했습니다." + error);
      },
      () => {
        upLoadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageUrl(downloadURL);
        });
      }
    );
  };

  const pfImgChange = async() => {
    try {
      const res = await api.pfImgChange(memberNum, imageUrl);
      console.log(res.data);
      if(res.data === true) {
        setChangeProfileImg(false);
        props.changeIsChange(++cnt);
        setImageUrl("");
      } else {

      }
    } catch (e) {
      console.log("로그인 에러..");
      console.log(e);
    }
  }


  // const [file, setFile] = useState();
  // const onFileChange = (event) => {
  //   // Updating the state
  //   setFile({ file: event.target.files[0] });
  // };

  //닉네임 input
  const onChangeMemberInfoNewNickInput = (e) => {
    const infoNewNickInput = e.target.value;
    setInfoNewNickInput(infoNewNickInput);
    if(!nickRegEx.test(infoNewNickInput) && !(infoNewNickInput.length === 0)) {
      setIsInfoNewNick(false);
      setInfoNewNickMsg("15자리 이하 한글,영문자,숫자를 입력해주세요.");
    } else if (!isInfoNewNickCk && !(infoNewNickInput.length === 0)) {
      setIsInfoNewNick(false);
      setInfoNewNickMsg("닉네임 중복 확인이 필요합니다.")
    };
  }

  //닉네임 중복확인
  const onClickInfoNewNickDupBtn = () => {
    console.log("닉네임 중복체크 할 때 들어온 값" + infoNewNickInput);
    if(nickRegEx.test(infoNewNickInput)) {
      const newNickFetchData = async () => {
        try {
          const response = await api.memberNickDup(infoNewNickInput);
          if(response.data === true) {
            setIsInfoNewNick(true)
            setIsInfoNewNickCk(true)
            setInfoNewNickOkMsg("사용 가능한 닉네임 입니다.")
          } else if(response.data === false) {
            setIsInfoNewNick(false)
            setIsInfoNewNickCk(true)
            setInfoNewNickMsg("이미 존재하는 닉네임 입니다.")
          }
        } catch (e) {
          console.log(e)
        }
      };
      newNickFetchData();
    }else{
      setIsInfoNewNick(false)
      setIsInfoNewNickCk(false)
      setInfoNewNickMsg("닉네임 형식을 확인 후 중복 체크를 해주세요.")
    }
  }

  //닉네임 변경 완료 버튼
  const onClickInfoNewNickChangeBtn = () => {
    const newNickOkFetchData = async () => {
      try {
        const response = await api.infoNewNickOk(memberNum, infoNewNickInput);
        console.log(response.data);
        if(response.data === true) {
          setIsInfoNewNick(true)
          setInfoNewNickOkMsg("닉네임이 변경되었습니다.")
        } else {
          setIsInfoNewNick(false)
          setInfoNewNickMsg("닉네임 형식을 확인 후 중복 체크를 해주세요.")
        }
      }catch (e) {
        console.log(e)
      }
    }
    newNickOkFetchData(); 
  }

  //현재 비밀번호 맞는지 ck
  const onClickPwdUpdate1 = async() => {
      try {
          const res = await api.currentPwd(memberNum, inputPwd1);
          console.log(res.data);
          if(res.data === true) {
              console.log("비밀번호 체크중");
              onClickPwdUpdate2();
          }           
      } catch (e) {
          console.log("현재 비밀번호 체크 에러..");
      }
  }

  //새 비밀번호 변경
  const onClickPwdUpdate2 = async() => {
      try {
          const memberResetPwd = await api.infoResetPwd(memberNum, inputPwd2);
          console.log(memberResetPwd.data.result);
          
          if(memberResetPwd.data === true) {
            setIsConPw(true);
            setConPwMessage2('비밀번호가 변경되었습니다.')           
          } else {
            setIsConPw(false);
            setConPwMessage2('비밀번호 변경에 실패하였습니다.') 
          }
      } catch (e) {
          console.log(e);
          console.log("비밀번호 변경 에러...!");
      }
  }

  //새 비밀번호 유효성 ck
  const onChangepwd2 = (e) => {
      //const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
      const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{8,20}$/
      const passwordCurrent = e.target.value ;
      setInputPwd2(passwordCurrent);
      if (!passwordRegex.test(passwordCurrent)) {
          setPwMessage('영소문자+숫자+특수문자 8자리 이상 20자리 이하 입력해주세요!')
          setIsPw(false)
      } else {
          setPwMessage('안전한 비밀번호에요 : )')
          setIsPw(true);
      }        
  }

  //새 비밀번호 확인 일치 ck
  const onChangepwd3 = (e) => {
      const passwordCurrent2 = e.target.value;
      setInputPwd3(passwordCurrent2)
      if (passwordCurrent2 !== inputPwd2) {
          setConPwMessage2('비밀 번호가 일치하지 않습니다.')
          setIsConPw(false)
      } else {
          setConPwMessage2('비밀 번호가 일치 합니다. )')
          setIsConPw(true);
      }      
  }

  //현재 비밀번호 맞는지 ck
  const onChangepwd1 = (e) => {
      const currentPwd = e.target.value;
      setInputPwd1(currentPwd)
      // if (passwordCurrent !== getPwd) {
      //     setConPwMessage('비밀 번호가 일치하지 않습니다.')
      //     setIsConPw(false)
      // } else {
      //     setConPwMessage('비밀 번호가 일치 합니다.')
      //     setIsConPw(true);
      // }      
  }


    //기존 이메일 출력
    // useEffect(() => {    
    // const memberData = async () => {
    //     try {
    //         const response = await api.memberInfo(getNickname);
    //         setMemberInfo(response.data);
    //         console.log(response.data)
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };
    // memberData();
    // }, []);

    //새 이메일 변경
    //변경을 누르면 새로운 이메일이 db에 변경됨
    const onClickEmailUpdate = async() => {
        try {
            const memberResetEmail = await api.infoResetEmail(memberNum, inputEmail);
            console.log(memberResetEmail.data);
            
            if(memberResetEmail.data === true) {
              setIsEmail(true);
              setEmailMessage('이메일이 변경되었습니다.')             
            } else {
            }
        } catch (e) {
            console.log(e);
            console.log("이메일 변경 에러...!");
        }
    }

    const onChangemail = (e) => {
      const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      const emailCurrent = e.target.value ;
      setInputEmail(emailCurrent);
      if (!emailRegex.test(emailCurrent)) {
          setEmailMessage('이메일 형식이 아닙니다.')
          setIsEmail(false)
      } else {
          setEmailMessage('')
          setIsEmail(true);
      }        
  }

  //광고 수신 여부 
  const onClickAdRadio = (e) => {
    setInfoAd(e.target.value);
    console.log(infoAd);
  }
  
  const onClickIsAdOkBtn = async () => {
    try {
      const infoAdFetchData = await api.infoIsAd(memberNum, infoAd)
      console.log(infoAdFetchData.data);
      if(infoAdFetchData.data === true) {
        setIsInfoAd(true);
        setInfoAdOkMsg('광고 수신 여부가 변경되었습니다.')
      }
    }catch(e) {
      console.log(e)
      console.log("광고수신여부 변경 에러...!");
    }
  }

  // const handleClickRadioButton = (e) => {
  //   console.log("선택한 값 : " + e.target.value);
  //   setMail(e.target.value);
  //   setDisabled(false);
  // }

  //주최자 소개
  const onChangeIntroduce = (e) => {
    setInputIntroduce(e.target.value);
  }

  //주최자 소개 변경하기
  const onClickNewIntroduceBtn = async () => {
    try {
      const infoIntroduceFetchData = await api.infoIntroduce(memberNum, inputIntroduce)
      console.log(infoIntroduceFetchData.data);
      if(infoIntroduceFetchData.data === true) {
        setIsInfoIntroduce(true);
        setInfoIntroduceOkMsg("주최자 소개 내용이 변경되었습니다.");
      }
    }catch(e){
      console.log(e)
      console.log("주최자 소개 내용 변경 오류")
    }
  }

  //test
  return(
    <div className="changememberinfo">
      <p>회원정보 수정</p>

      {!changeProfileImg && !changeEmail && !changePwd  && !changeReceiveAd && !changeHost && 
      <p onClick={()=>{setChangeNickname(true)}} onDoubleClick={()=>{setChangeNickname(false)}}>닉네임 변경</p>}
      {changeNickname && 
        <div className="infoResetNick_container">
          {error && {error}} 
          <div className="">
          {
            <>
            <div>              
              <p className="infoCurrentNick">현재 닉네임</p>
              <p>{props.memberInfo.nickname}</p>
            </div>
            <div>
            <p className="infoNewNick">새 닉네임</p>
            <p>
            <input type="text" value={infoNewNickInput} className="infoNewNickInput" onChange={onChangeMemberInfoNewNickInput}></input>
            <button className="infoNewNickDupBtn" onClick={onClickInfoNewNickDupBtn}>중복확인</button>
            </p>
            </div>
            <div className="infoNewNickMsg">
              {!isInfoNewNick && <span className="infoNewNickMsg">{infoNewNickMsg}</span>}
              {isInfoNewNick && <span className="infoNewNickMsg">{infoNewNickOkMsg}</span>}
            </div>
            <div className="infoNewNickChangeBtnOut">
              <button className="infoNewNickChangeBtn" onClick={onClickInfoNewNickChangeBtn}>변경</button>
            </div> 
            </>          
          }
          </div>           
        </div>
      }

      {!changeProfileImg && !changeEmail && !changeNickname && !changeReceiveAd && !changeHost && <p onClick={()=>{setChangePwd(true)}}
      onDoubleClick={()=>{setChangePwd(false)}}>비밀번호 변경</p>}
      {changePwd && 
        <div className="infoResetPwd_container">
          {error && {error}}        
            <div className="pwd_current">현재 비밀번호</div>
            <div>
            <input type="password" value={inputPwd1} className="pwd_change_input" onChange={onChangepwd1}></input>
            </div>
            <div className="current_pwd_hint">
            {inputPwd1.length > 0 && (
                <span className={`message ${isConPw ? 'success' : 'error'}`}>{conPwMessage}</span>)}
            </div>
            <div className="pwd_change_ck">새 비밀번호</div>
            <div>
            <input type="password" value={inputPwd2} className="pwd_change_input" onChange={onChangepwd2}></input>
            </div>
            <div className="pwd_hint">
                {inputPwd2.length > 0 && (
                <span className={`message ${isPw ? 'success' : 'error'}`}>{pwMessage}</span>)}
            </div>
            <div className="pwd_change_ck2">새 비밀번호 확인</div>
            <div>
            <input type="password" value={inputPwd3} className="pwd_change_input" onChange={onChangepwd3}></input>
            </div>
            <div className="pwd_hint2">
                {inputPwd3.length > 0 && (
                <span className={`message ${isConPw ? 'success' : 'error'}`}>{conPwMessage2}</span>)}
            </div>
            <div className="pwd_change_yes">
            <button onClick={onClickPwdUpdate1}>변경</button>
            </div>
        </div>
      }
      

      {!changeProfileImg && !changePwd && !changeNickname && !changeReceiveAd && !changeHost && <p onClick={()=>{setChangeEmail(true)}}
      onDoubleClick={()=>{setChangeEmail(false)}}>이메일 변경</p>}
        {changeEmail &&
          <div className="infoResetEmail_container">
            <div className="currentEmail">
              <span>현재 이메일 주소</span>
            </div>
            <div className="email_current">
              <span>{props.memberInfo.email}</span>
            </div>             
            <div className="email_new">
              <span>새 이메일 주소</span>
            </div>
            <div>
              <input type="email" value={inputEmail} className="pwd_change_input" onChange={onChangemail}></input>
            </div>              
            <div className="email_hint">
              {inputEmail.length > 0 && (
              <span className={`message ${isEmail ? 'success' : 'error'}`}>{emailMessage}</span>)}
            </div>
            <div className="email_change_yes">
            <button onClick={onClickEmailUpdate}>변경</button>
            </div>
          </div>
        }

      {!changeProfileImg && !changePwd && !changeEmail && !changeNickname && !changeHost &&<p onClick={()=>{setChangeReceiveAd(true)}}
            onDoubleClick={()=>{setChangeReceiveAd(false)}}>광고 수신 여부 변경</p>}
            {changeReceiveAd && 
              <div className="infoResetAd_container">
                <div className="current_Ad">
                  <span>현재 광고 수신 여부는 <span className="infoReceiveAd">{props.memberInfo.receiveAd === "POSITIVE"? "허용" : "거부"}</span>입니다.</span>
                </div>
                <div className="infoResetAd">
                  {/* <label><input type="radio" name="Ad" checked={props.memberInfo.receiveAd === "POSITIVE"}/>허용</label>
                  <label><input type="radio" name="Ad" checked={props.memberInfo.receiveAd === "NEGATIVE"}/>거부</label> */}
                  <label><input type="radio" name="Ad" value='POSITIVE' onClick={onClickAdRadio}/>허용</label>
                  <label><input type="radio" name="Ad" value='NEGATIVE' onClick={onClickAdRadio}/>거부</label>
                </div>
                <div className="infoResetAdMsg">
                  {isInfoAd ? <span>{infoAdOkMsg}</span> : <span>{infoAdErrMsg}</span>} 
                </div>
                <div className="ad_change_yes">
                  <button onClick={onClickIsAdOkBtn}>변경</button>
                </div>
              </div>
            }

      {!changeEmail && !changePwd && !changeNickname && !changeReceiveAd && !changeHost && 
      <p onClick={()=>{setChangeProfileImg(true)}} onDoubleClick={()=>{setChangeProfileImg(false)}}>프로필 사진 변경</p>}
      {changeProfileImg && 
        <div className="pfImgChange">
          {error && {error}}
          <form className="pfImgForm" onSubmit={onSubmit}>
            <input type="file" onChange={handleImage} />
            <button onClick={onSubmit}>업로드</button>
          </form>
          {imageUrl && (
            <div>
              <p> 이미지 미리보기</p>
              <img className="pfImgPreview" src={imageUrl} alt="uploaded" />
              {/* width="400px" */}
            </div>
          )}
          <button type="button" onClick={pfImgChange}>업로드한 이미지로 프로필 변경</button>
        </div>
      }

      
    {!changeEmail && !changeProfileImg && !changePwd && !changeNickname && !changeReceiveAd && <p onClick={()=>{setChangeHost(true)}}
      onDoubleClick={()=>{setChangeHost(false)}}>주최자 소개 변경</p>}
          {changeHost &&
            <div className="pfImgChange">
              <div>
                현재 주최자 소개 내용
              </div>
              <div>
                {/* {!props.memberInfo.introduce && <p>현재 주최자 소개가 없습니다.</p>} */}
                {props.memberInfo.introduce ? 
                <span>{props.memberInfo.introduce}</span> : <span>현재 주최자 소개가 없습니다.</span>}
              </div>
              <p className="email_new">
                <div>
                  새 주최자 소개 내용
                </div>
                <div>
                  <textarea value={inputIntroduce} onChange={onChangeIntroduce} className="pwd_change_input"/>
                </div>
              </p>
              {isInfoIntroduce ? <span>{infoIntroduceOkMsg}</span> : <span>{infoIntroduceErrMsg}</span>}
              <button onClick={onClickNewIntroduceBtn}>변경</button>
        </div>
        }

      
    </div>
  );
};

export default ChangeMemberInfo;