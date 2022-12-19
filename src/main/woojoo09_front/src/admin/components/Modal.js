
const Modal = ({ setModalOpen, imgUrl}) => {
  // 모달 끄기 
  const closeModal = () => {
      setModalOpen(false);
  };

  if(imgUrl){
    return (
      <div className="modalcontainer">
        <button className="modalclose" onClick={closeModal}>
          X
        </button>
        <p>
          <img className="modalimg" src={imgUrl}/>
        </p>
      </div>
    );
  }
  
}
export default Modal;