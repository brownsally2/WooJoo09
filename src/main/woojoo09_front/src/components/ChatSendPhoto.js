import React from "react";
import { useState } from "react";
import "../style/chat.scss"
import { storage } from "../api/firebase"
import {uuidv4} from "../util/util"
import imgIcon from "../resources/images_icon.png"

const SendPhoto =() => {

  const [SendPhoto, setSendPhoto] = useState("");
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [representUrl, setRepresentUrl] = useState("");
  const [error, setError] = useState("");
  

  const onChangeSendPhoto = (e) => {
    setSendPhoto(e.target.value);
  }

  const handleImage = (e) => {
    setUrls([]);
    let imgNum = 0;

    if (e.target.files.length === 0) {
      console.log("파일이 선택되지 않았습니다");
      setError("파일이 선택되지 않았습니다");
      setImages([]);
      setUrls([]);
      return;
    }

    for(const image of e.target.files){
      setImages((prevState) => [...prevState, image]);
      imgNum++;
      console.log(imgNum);

      if(imgNum > 5){
        // setError("이미지 갯수 초과");
        break;
      }
    }
    if(imgNum > 5) {
      setError("이미지는 대표이미지 포함 최대 6장까지 선택 가능합니다");
      setImages([]);
    } 
    else setError("");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (images.length < 1) {
      console.log("파일이 선택되지 않았습니다");
      setError("파일이 선택되지 않았습니다");
      return;
    }

    if ( images.length > 5){
      console.log("이미지는 대표이미지 포함 최대 6장까지 선택 가능합니다");
      setError("이미지는 대표이미지 포함 최대 6장까지 선택 가능합니다");
      setImages([]);
      return;
    }

    let imgNum = 1;

    for (const image of images){
       // 업로드 처리
      console.log("업로드 처리");
      const storageRef = storage.ref("woojoo09/tradeImg/"); //어떤 폴더 아래에 넣을지 설정
      // const imgName = (memberNum + "host"+ numOfTrade + "thTrade" + imgNum + "thImg");
      // const imagesRef = storageRef.child(imgName);
      const imagesRef = storageRef.child(uuidv4());
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
            setUrls((prevState) => [...prevState, downloadURL]);
          });
        }
      );
      imgNum++;
    }
    setImages([]);
  };



    return (

        <div className="chatSendFile">
        {/* <div>사진</div>
          <input type="file" value={SendPhoto} onChange= {onChangeSendPhoto}/> */}

      <div className="chatImgInput">
        <form className="chatWriteImgInput" onSubmit={onSubmit}>
          <label><span>상품 이미지</span>
          <img src={imgIcon} alt="상세이미지등록"/>
          <input multiple type="file" accept="image/*" onChange={handleImage} />
          </label>
          {images.length > 0 && 
          images.map((image)=>(<p className='imglst'>{image.name}</p>))}
          {images.length > 0 && 
          <button onClick={onSubmit}>선택 이미지 등록</button>}
        </form>
            {error && <p className='chatImgErr'>{error}</p>}
            {(urls.length >= 1) && (
              <div className="chatImgPreview">
                <p>이미지 미리보기</p>
                <div>
                {urls.map((imageUrl)=>(<img className="chatWriteImgPreview" src={imageUrl} alt="uploaded"/>))}
                </div>
              </div>
            )}
      </div>

          <button>전송</button>
      </div>
    )
}
export default SendPhoto