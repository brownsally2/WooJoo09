import PacmanLoader from "react-spinners/PacmanLoader";
const Loader = () =>{
  return(
      <div className="loaderWrap"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%"
        }}
      >
        <PacmanLoader
          color="#36d7b7"
          size={50}
        />
      </div>
  );
};

export default Loader;