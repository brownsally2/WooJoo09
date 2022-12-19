import { useState, useEffect } from "react";
import api from "../../adminApi";
import Loader from "../../components/Loader";
import TopBar from "../../components/TopBar";
import { Link } from "react-router-dom";
import { storage } from "../../../api/firebase"
import Header from "../../components/Header";
import Sidebar from "../../components/SideBar";

const AdManagementAdd = () =>{
  const [lists, setLists] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState(false);

  const [ad_name, setad_name] = useState('');
  const [ad_url, setad_url] = useState('');
  const [ad_img, setad_img] = useState('');

  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");


  const onChangeAd_name = (e) => setad_name(e.target.value);
  const onChangeAd_url = (e) => setad_url(e.target.value);

  // 체크된 아이템을 담을 배열
  const [checkItems, setCheckItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
     setLoading(true);
      try {
        const response = await api.adInfo();
        setLists(response.data);
        setPrepared(true);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if(loading) {
    return <div className="center"><Loader/></div>
  }

  const adminAdAdd = async () =>{

    const fetchAdUpdateData = async () => {
      setLoading(true);
       try {
         const response = await api.adminAdAdd(ad_name, ad_url, ad_img);
         setLists(response.data);
         setPrepared(true);
       } catch (e) {
         console.log(e);
       }
       setLoading(false);
     };
     fetchAdUpdateData();
     window.location.reload();
  }
  

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
    const storageRef = storage.ref("images/advertisement/"); //어떤 폴더 아래에 넣을지 설정
    const imgName = (ad_name + "Img");
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
          setad_img(downloadURL)
        });
      }
    );
  };

  return(
    <div className="adminWrapper">
    <Header/>
    <Sidebar/>
    <div className="center">
      <TopBar name="배너 추가" high1="배너 관리" high2="광고 관리"/>
      <div>
      <label>
          <span>광고 이름</span>
          <input type="text" value={ad_name} onChange={onChangeAd_name}/>
        </label>
        <label>
          <span>광고 이동 URL</span>
          <input type="text" value={ad_url} onChange={onChangeAd_url}/>
        </label>
        <label>
          <span>광고 이미지</span>
          {error && {error}}
          <form className="adImgForm" onSubmit={onSubmit}>
            <input type="file" onChange={handleImage} />
            <button onClick={onSubmit}>업로드</button>
          </form>
          {imageUrl && (
            <div>
              <p> 이미지 미리보기</p>
              <img className="adImgPreview" src={imageUrl} alt="uploaded"/>
            </div>
          )}
        </label>
        <br/>
        <button onClick={adminAdAdd}><Link to={"/adManagement"}>등록하기</Link></button>
      </div>
    </div>
    </div>
  );
};
export default AdManagementAdd;
