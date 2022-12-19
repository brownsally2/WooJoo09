import { useState, useEffect } from "react";
import { storage } from "../api/firebase"
import { Link } from "react-router-dom";
import api from "../api/api";

const ChangeMemberInfo = (props) =>{
  const memberNum = props.memberNum;
  // console.log(memberNum);
  // console.log(props.memberNum);

  const [changeNickname, setChangeNickname] = useState(false);
  const [changeProfileImg, setChangeProfileImg] = useState(false);
  const [changePwd, setChangePwd] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changeReceiveAd, setChangeReceiveAd] = useState(false);
  let cnt = 0;
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  
  const [memberInfo, setMemberInfo] = useState('');
  
  const [inputPwd1, setInputPwd1] = useState('');
  const [inputPwd2, setInputPwd2] = useState('');
  const [inputPwd3, setInputPwd3] = useState('');
  const getNickname = window.localStorage.getItem("userNickname");
  const getPwd =  window.localStorage.getItem("userPwd");

  const [mail,setMail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [disabled, setDisabled] = useState(true);

  const [changeHost,setChangeHost] = useState(false);


  //오류메시지

  const [pwMessage, setPwMessage] = useState("");
  const [conPwMessage, setConPwMessage] = useState("");
  const [conPwMessage2, setConPwMessage2] = useState("");

  // 유효성 검사
  const [isPw, setIsPw] = useState(false)
  const [isConPw, setIsConPw] = useState(false);

    
    //유효성 검사
  const [isEmail, setIsEmail] = useState(false)

    //오류메시지
  const [emailMessage, setEmailMessage] = useState("");

  //닉네임 관련
  const nickRegEx = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{1,15}$/;
  const [newNickInfo, setNewNickInfo] = useState('');
  const [infoNewNickInput, setInfoNewNickInput] = useState('');
  const [infoNewNickMsg, setInfoNewNickMsg] = useState("");
  const [infoNewNickOkMsg, setInfoNewNickOkMsg] = useState("");
  const [isInfoNewNick, setIsInfoNewNick] = useState(false);
  const [isInfoNewNickCk, setIsInfoNewNickCk] = useState(false);

const [inputIntroduce, setInputIntroduce] = useState(props.memberInfo.introduce);



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
    const imgName = (localStorage.getItem("memberNum") + "_pfImg");
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

  // useEffect(() => {
  //   const newNickData = async () => {
  //     try {
  //       const response = await api.memberInfoNewNick(memberNum);
  //       setNewNickInfo(response.data);
  //       console.log(response.data)
  //       setChangeNickname(true)     
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   newNickData();
  // }, []);

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
              // onClickPwdUpdate2();
          }           
      } catch (e) {
          console.log("현재 비밀번호 체크 에러..");
      }
  }

  //새 비밀번호 변경
  const onClickPwdUpdate2 = async() => {
      try {
          const memberUpdate = await api.memberUpdate(inputPwd3, "pwd", getNickname);
          console.log(memberUpdate.data.result);
          
          if(memberUpdate.data.result === "OK") {
              window.location.replace("/memberInfo");
          } else {
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

  // 통신 부분 에러때문에 주석 처리
//   const pfImgChange = async() => {
//     try {
//       const res = await api.pfImgChange(imageUrl);
//       console.log(res.data.result);
//       if(res.data.result === "OK") {
//         setChangeProfileImg(false);
//         props.changeIsChange(++cnt);
//         // window.location.replace("/memberinfo");
//       } else {

//       }
//     } catch (e) {
//       console.log("로그인 에러..");
//       console.log(e);
//     }
//   }
// 여기까지

  // const [file, setFile] = useState();
  // const onFileChange = (event) => {
  //   // Updating the state
  //   setFile({ file: event.target.files[0] });
  // };


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
            const memberUpdate = await api.memberUpdate(inputEmail, "mail", getNickname);
            console.log(memberUpdate.data.result);
            
            if(memberUpdate.data.result === "OK") {
                window.location.replace("/memberInfo");
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

  const handleClickRadioButton = (e) => {
    console.log("선택한 값 : " + e.target.value);
    setMail(e.target.value);
    setDisabled(false);
  }
  //test
  return(
    <div className="changememberinfo">
      <p>회원정보 수정</p>

      {!changeProfileImg && !changeEmail && !changePwd  && !changeReceiveAd && !changeHost && 
      <p onClick={()=>{setChangeNickname(true)}} onDoubleClick={()=>{setChangeNickname(false)}}>닉네임 변경</p>}
      {changeNickname && 
        <div className="pfImgChange">
          {error && {error}} 
          <div className="pwdchange_container">
          {
            <>
            <div>              
              <p className="pwd_current">현재 닉네임 : {props.memberInfo.nickname}</p>
            </div>
            <div className="current_pwd_hint">
              {inputPwd1.length > 0 && (
                <span className={`message ${isConPw ? 'success' : 'error'}`}>{conPwMessage}</span>)}
            </div>
            <p className="pwd_change_ck">새 닉네임
              <input type="text" value={infoNewNickInput} className="pwd_change_input" onChange={onChangeMemberInfoNewNickInput}></input>
              <button className="infoNewNickDupBtn" onClick={onClickInfoNewNickDupBtn}>중복확인</button>
            </p>
            <div className="infoNewNickMsg">
              {!isInfoNewNick && <span className="infoNewNickMsg">{infoNewNickMsg}</span>}
              {isInfoNewNick && <span className="infoNewNickMsg">{infoNewNickOkMsg}</span>}
            </div>
            <div>
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
        <div className="pfImgChange">
          {error && {error}}
          <div className="pwdchange_container">
            <p className="pwd_current">현재 비밀번호
            <input type="password" value={inputPwd1} className="pwd_change_input" onChange={onChangepwd1}></input>
            </p>
            <div className="current_pwd_hint">
            {inputPwd1.length > 0 && (
                <span className={`message ${isConPw ? 'success' : 'error'}`}>{conPwMessage}</span>)}
            </div>
            <p className="pwd_change_ck">새 비밀번호
            <input type="password" value={inputPwd2} className="pwd_change_input" onChange={onChangepwd2}></input>
            </p>
            <div className="pwd_hint">
                {inputPwd2.length > 0 && (
                <span className={`message ${isPw ? 'success' : 'error'}`}>{pwMessage}</span>)}
            </div>
            <p className="pwd_change_ck2">새 비밀번호 확인
            <input type="password" value={inputPwd3} className="pwd_change_input" onChange={onChangepwd3}></input>
            </p>
            <div className="pwd_hint2">
                {inputPwd3.length > 0 && (
                <span className={`message ${isConPw ? 'success' : 'error'}`}>{conPwMessage2}</span>)}
            </div>
            <span className="pwd_change_yes" onClick={onClickPwdUpdate1}>변경</span>
         </div>
        </div>
      }
      

      {!changeProfileImg && !changePwd && !changeNickname && !changeReceiveAd && !changeHost && <p onClick={()=>{setChangeEmail(true)}}
      onDoubleClick={()=>{setChangeEmail(false)}}>이메일 변경</p>}
          {changeEmail &&
            <div className="pfImgChange">
              <p className="email_current">{props.memberInfo.email}</p>
              {/* {memberInfo && memberInfo.map(member => (
                  <div key={member.nickname}>
                      <p className="email_current2">{member.email}</p>
                  </div>
              ))} */}
              <p className="email_new">
                  <p>새 이메일 주소
                  <input type="email" value={inputEmail} className="pwd_change_input" onChange={onChangemail}></input>
                  </p>
              </p>
              <div className="email_hint">
                  {inputEmail.length > 0 && (
                  <span className={`message ${isEmail ? 'success' : 'error'}`}>{emailMessage}</span>)}
              </div>
              <span className="email_change_yes" onClick={onClickEmailUpdate}>변경</span>
        </div>
        }

      {!changeProfileImg && !changePwd && !changeEmail && !changeNickname && !changeHost &&<p onClick={()=>{setChangeReceiveAd(true)}}
            onDoubleClick={()=>{setChangeReceiveAd(false)}}>광고 수신 여부 변경</p>}
            {changeReceiveAd && 
              <div className="pfImgChange">
                <div className="pwdchange_container">
                  <p className="pwd_current">현재 광고 수신 여부는 {props.memberInfo.receiveAd === "ACTIVE"? "허용" : "거부"}입니다.</p>
                    <div>
                    <label><input type="radio" name="Ad" checked={props.memberInfo.receiveAd === "ACTIVE"}/>허용</label>
                    <label><input type="radio" name="Ad" checked={props.memberInfo.receiveAd === "NEGATIVE"}/>거부</label>
                    </div>
                    
                  <span className="pwd_change_yes" onClick={onClickPwdUpdate1} disabled ={disabled}>변경</span>
              </div>
              </div>
            }

      {!changeEmail && !changePwd && !changeNickname && !changeReceiveAd && !changeHost && <p onClick={()=>{setChangeProfileImg(true) }}
      onDoubleClick={()=>{setChangeProfileImg(false)}}>프로필 사진 변경</p>}
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
          {/* onClick={pfImgChange} 넣어야함  */}
          <button type="button" >업로드한 이미지로 프로필 변경</button>
        </div>
      }

      
    {!changeEmail && !changeProfileImg && !changePwd && !changeNickname && !changeReceiveAd && <p onClick={()=>{setChangeHost(true)}}
      onDoubleClick={()=>{setChangeHost(false)}}>주최자 소개 변경</p>}
          {changeHost &&
            <div className="pfImgChange">
              <div>
                {!props.memberInfo.introduce && <p>현재 주최자 소개가 없습니다.</p>}
              </div>
              {memberInfo && memberInfo.map(member => (
                  <div key={member.nickname}>
                      <p className="email_current2">{member.email}</p>
                  </div>
              ))}
              {/* <div >
                      <p className="email_current2">rabbit@gmail.com</p>
              </div> */}
              <p className="email_new">
                  <p>새 주최자 소개
                  <textarea  value={inputIntroduce} className="pwd_change_input" onChange={onChangemail}/>
                  </p>
              </p>
              <div className="email_hint">
                  {inputEmail.length > 0 && (
                  <span className={`message ${isEmail ? 'success' : 'error'}`}>{emailMessage}</span>)}
              </div>
              <span className="email_change_yes" onClick={onClickEmailUpdate}>변경</span>
              {/* <Link to='/member' className="email_cancle">취소</Link> */}
        </div>
        }

      
    </div>
  );
};

export default ChangeMemberInfo;