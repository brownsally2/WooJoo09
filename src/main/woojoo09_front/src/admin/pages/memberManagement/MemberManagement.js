import { useState, useEffect } from "react";
import api from "../../adminApi";
import SearchBar from "../../components/SearchBar";
import TopBar from "../../components/TopBar";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Header from "../../components/Header";
import Sidebar from "../../components/SideBar";

const MemberManagement = () =>{
  const [lists, setLists] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  const [pageStart, setPageStart] = useState(0);

  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState(false);
  
  const [inputSearch, setInputSearch] = useState('');

  const [thisProfile, setThisProfile] = useState('');

  // 모달창 노출 여부 state
  const [modalOpen, setModalOpen] = useState(false);

  // 모달창 노출
  const showModal = () => {
      setModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
     setLoading(true);
      try {
        const response = await api.memberInfo();
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

  const onChangeSearch = (e) =>{
    setInputSearch(e.target.value);
  }

  const memberSearch = () =>{
    window.localStorage.setItem("target", inputSearch);
    setPrepared(false);
    const fetchSearchData = async () => {
      setLoading(true);
       try {
         const response = await api.memberInfoSearch();
         setLists(response.data);
         setPrepared(true);
       } catch (e) {
         console.log(e);
       }
       setLoading(false);
     };
    fetchSearchData();
  }
    return(
      <div className="adminWrapper">
        <Header/>
        <Sidebar/>
      <div className="center">
        <TopBar name="회원 현황" high1="회원 관리"/>
        <div className="searchBar">
          <input type="text" placeholder="회원번호/닉네임/등급" value ={inputSearch} onChange={onChangeSearch}/>
          <button onClick={memberSearch}>검색</button>
        </div>
        <div>
          <label className="pageselect">
            페이지 당 표시할 회원 수:&nbsp;
            <select
              type="number"
              value={limit}
              onChange={({ target: { value } }) => {
                setLimit(Number(value));
                setPage(1);
                setPageStart(0);
              }}
            >
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="10" selected>10</option>
              <option value="12">12</option>
              <option value="20">30</option>
            </select>
          </label>
          <div className="tableWrapper">
            <table className="membertb">
              <thead>
                <tr>
                  <th>회원번호</th>
                  <th>닉네임</th>
                  <th>등급</th>
                  <th>게시글 수</th>
                  <th>댓글 수</th>
                  <th>핸드폰 번호</th>
                  <th>이메일</th>
                  <th>가입일</th>
                  <th>프로필 이미지</th>
                  <th>광고 수신 동의 여부</th>
                </tr>
              </thead>
              <tbody>
                { prepared &&
                  lists.slice(offset, offset + limit)
                  .map(({ memberNum, nickname, grade, countWrite, countComment, phone, email, regDate, pfImg, isAdOk }) => (
                    <tr>
                      <td>{memberNum}</td>
                      <td>{nickname}</td>
                      <td>{grade}</td>
                      <td>{countWrite}</td>
                      <td>{countComment}</td>
                      <td>{phone}</td>
                      <td>{email}</td>
                      <td>{regDate}</td>
                      <td>
                        {pfImg && <button onClick={() =>{
                          showModal()
                          setThisProfile(pfImg)
                        }}>이미지 보기</button>}
                        {modalOpen && <Modal setModalOpen={setModalOpen} imgUrl={thisProfile}/>}
                      </td>
                      <td>{isAdOk? "O":"X"}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <Pagination
            total={lists.length}
            limit={limit}
            page={page}
            setPage={setPage}
            pageStart={pageStart}
            setPageStart={setPageStart}
          />
        </div>
      </div>
      </div>
    );
};
export default MemberManagement;