import { useEffect, useState } from "react";
import Docs from "../components/Docs";
import Navbar from "../components/Navbar"
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { api_base_url } from "../Helper";
import { useNavigate } from 'react-router-dom';



const Home = () => {

  const [isCreateModelShow, setIsCreateModelShow] = useState(false);

  const [title, setTitle] = useState("");
  const [setError] = useState("");

  const navigate = useNavigate();

  const [data, setData] = useState(null);


  const createDoc = () => {
    if (title === "") {
      setError("Please enter title");
    }
    else {
      fetch(api_base_url + "/createdoc", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docName: title,
          userId: localStorage.getItem("userId")
        })
      }).then(res => res.json()).then(data => {
        if (data.success) {
          setIsCreateModelShow(false);
          navigate(`/createdocs/${data.docId}`)
        }
        else {
          setError(data.message);
        }
      })
    }
  }


  const getData = () => {
    fetch(api_base_url + "/getalldocs", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      setData(data.docs);
    })
  };

  useEffect(() => {
    getData();
  }, [])


  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between px-[100px]">
        <h3 className='mt-7 mb-3 text-3xl'>All Documents</h3>
        <button className="btnBlue" onClick={() => {
          setIsCreateModelShow(true);
          document.getElementById('title').focus();
        }}><i><FaPlus /></i> Create New Document</button>
      </div>

      <div className='allDocs px-[100px] mt-4'>
        {
          data ? data.map((el, index) => {
            return (
              <>
                <Docs docs={el} docID={`doc-${index + 1}`} />
              </>
            )
          }) : ""
        }
      </div>

      {
        isCreateModelShow ? <>
          <div className="createDocsModelCon top-0 left-0 right-0 bottom-0 fixed bg-[rgb(0,0,0,.3)] w-screen h-screen flex flex-col items-center justify-center">
            <div className="createDocsModel p-[15px] bg-[#282727] rounded-lg w-[30vw] h-[28vh]">
              <h3 className="text-[20px] ">Create New Document</h3>

              <div className='inputCon mt-3'>
                <p className=' text-[14px] text-[#808080]'>Title</p>
                <div className="inputBox w-[100%]">
                  <i><FaSearch /></i>
                  <input onChange={(e) => { setTitle(e.target.value) }} value={title} type="text" placeholder='Title' id='title' name='title' required />
                </div>
              </div>

              <div className="flex -mt-2 items-center gap-2 justify-between w-full">
                <button onClick={createDoc} className='btnBlue !min-w-[49%]'>Create New Document</button>
                <button onClick={() => { setIsCreateModelShow(false) }} className='p-[10px] bg-[#D1D5DB] text-black rounded-lg border-0 cursor-pointer min-w-[49%]'>Cancel</button>
              </div>

            </div>
          </div>
        </> : ""
      }


    </>
  )
}

export default Home