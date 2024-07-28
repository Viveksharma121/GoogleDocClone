//mui icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import ShareIcon from "@mui/icons-material/Share";
import Fab from "@mui/material/Fab";
//axios to fetch form backend
import axios from "axios";
import React, { useEffect, useState } from "react";
//React quill for doc
import { default as ReactQuill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
//socketio for connections and room forming
// import dotenv from "dotenv";
import socketioClient from "socket.io-client";

//css for the page
import "./DocPage.css";
// modal
import AccessRequestsModal from "./AccessDenied/AccessReqModal";
import MenuBar from "./MenuBar";
import Modal from "./Modal/Modal";
const DocPage = () => {
  // dotenv.config();
  const BackendUrl = process.env.REACT_APP_BASE_URL;

  const socket_url = process.env.REACT_APP_SOCKET_URL;

  //Accesses the document id form the link so if link is http://192.168.117.153:3000/doc/d27284b3-e364-4a92-9b19-50d442884d91 , it accesses doc/d27284b3-e364-4a92-9b19-50d442884d91
  const docId1 = useParams();
  // to get the id from the docId1 "d27284b3-e364-4a92-9b19-50d442884d91"
  const docId = docId1.docId;

  console.log(docId);
  const history = useNavigate();

  //value here is content of the page
  const [value, setValue] = useState("");
  //socket to check and establist connection
  const [socket, setsocket] = useState(null);
  //to check if modal is open on not
  const [ismodelOpen, setismodelOpen] = useState(false);

  const [accessControl, setAccessControl] = useState(true);
  const [owner, setOwner] = useState(false);
  const [acessReq, setacessReq] = useState([]);
  useEffect(() => {
    const fetchAcessControl = async () => {
      try {
        const response = await axios.get(
          `${BackendUrl}api/share/getusers/${docId}`
        );
        console.log(response);
        const data = response.data.accessControl;
        console.log(data);
        const ourUser = sessionStorage.getItem("email");
        console.log(ourUser);
        if (ourUser === null && data === undefined) {
          console.log(accessControl);
          setAccessControl(true);
          return;
        }
        const userpermission = data.find((user) => user.userEmail === ourUser);
        console.log(userpermission);

        if (userpermission.userEmail === ourUser) {
          if (
            userpermission.accessLevel === "edit" ||
            userpermission.accessLevel === "Edit" ||
            userpermission.accessLevel === "owner"
          ) {
            setAccessControl(false);
            if (userpermission.accessLevel === "owner") setOwner(true);
          } else if (
            userpermission.accessLevel === "read" ||
            userpermission.accessLevel === "everyone"
          ) {
            setAccessControl(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAcessControl();

    //one more
    const handleAccess = async () => {
      const response = await axios.get(
        `${BackendUrl}api/access/get-access-request`,
        {
          params: {
            docId: docId,
          },
        }
      );
      console.log(response);
      if (response.data.message != null)
        setacessReq(response.data.message.accessControl);
      else setacessReq([]);
      // console.log(response.data.message.accessControl);
      // setUsers(response.data.message.userEmail);
      // console.log(users.length);1
    };
    handleAccess();
  }, [docId]);

  //text to voice
  const textTovoice = async () => {
    console.log(value);
    const utterance = new SpeechSynthesisUtterance(value);
    window.speechSynthesis.speak(utterance);
  };
  //Quill tools
  const modules = {
    clipboard: {
      matchVisual: false,
      preserveWhitespace: true,
    },
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ align: [] }],
      ["image", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  //when user X shares his doc to user Y or himself reloads the doc , this func will fetch all data from backend whenever the site is reloaded
  const fetchInitialContent = async () => {
    try {
      //simple get request
      const response = await axios.get(`${BackendUrl}get-doc-content/${docId}`);
      //extracting the data from response
      const data = response.data;
      // data: content: "<p>iv </p><p>gi </p><p>vivek </p>"
      // so we do data.content to get this content from data
      setValue(data.content);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("useEffect is running");

    //creates a new Websocket connection
    const newSocket = socketioClient(`${socket_url}`, {
      //optional
      transports: ["websocket"],
    });

    // when connected log socket connected and fetch the initial contents
    newSocket.on("connect", () => {
      console.log("Socket connected!");
      fetchInitialContent();
    });

    //emit==send , ie send the docId to the backend
    newSocket.emit("join-doc", docId);
    //if there is error in connection log that
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    //whenever dpcument changes are made just set the value to the data
    newSocket.on("doc-changes", (data) => {
      console.log("use eff data ", data);
      setValue(data);
    });

    //just simply setting the socket
    setsocket(newSocket);
    //cleanup when use effect is exited(ie page closed) we close the socket
    return () => {
      newSocket.disconnect();
    };
  }, [docId]);

  // whenever user writes something or changees something this function is called
  const handleChanges = (content, _, source) => {
    // this checks if changes are made by our user only its default in react quill
    if (source === "user") {
      //we set the value to whatever changes ie content is typed , content is also inbuilt
      setValue(content);
      if (socket) {
        //sending the changes to backend to save it to db
        socket.emit("doc-changes", { docId, content });
      }
    }
  };

  //As soon as share icon is clicked this function is called and the modal opens up
  const handleShare = () => {
    if (accessControl) {
      history(`/access-denied/${docId}`);
      return;
    }
    setismodelOpen(true);
    console.log("share btn clicked");
  };

  const [isReqmodelOpen, setisReqmodelOpen] = useState(false);
  const ReqModal = () => {
    setisReqmodelOpen(true);
  };
  const handleReqModalClose = () => {
    setisReqmodelOpen(false);
  };
  //gives all info of page
  const PageUrl = useLocation();

  //when modal is closed we call this
  const handleCloseModal = () => {
    setismodelOpen(false);
  };

  return (
    <div>
      <MenuBar QuillData={value} />
      {/* Basic share icon from mui */}
      <Fab
        style={{
          marginTop: "0.5rem",
          marginRight: "9rem",
          float: "right",
          cursor: "pointer",
        }}
        size="small"
        color="primary"
        aria-label="share"
        onClick={handleShare}
      >
        {accessControl === true ? <AddCircleIcon /> : <ShareIcon />}
      </Fab>
      {/* Basic acc icon from mui*/}
      <Fab
        style={{
          marginTop: "0.5rem",
          marginRight: "-6rem",
          float: "right",
          cursor: "pointer",
        }}
        size="small"
        color="primary"
        aria-label="share"
      >
        <AccountCircleIcon />
      </Fab>
      {owner && acessReq.length > 0 && (
        <Fab
          style={{
            marginTop: "0.5rem",
            marginRight: "1rem",
            float: "right",
            cursor: "pointer",
          }}
          size="small"
          color="primary"
          aria-label="share"
          onClick={ReqModal}
        >
          <MarkEmailUnreadIcon />
          <AccessRequestsModal
            isOpen={isReqmodelOpen}
            onClose={() => setisReqmodelOpen(false)}
            usersReq={acessReq}
          />
        </Fab>
      )}

      {/* Our react quill */}
      <div className="container">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChanges}
          modules={modules}
          readOnly={accessControl}
        />
      </div>
      {/*Modal page and some things are passed as props */}
      <Modal
        isOpen={ismodelOpen}
        onClose={handleCloseModal}
        urlToShare={`http://192.168.117.153:3000${PageUrl.pathname}`}
      />

      <button onClick={textTovoice}>Text to voice</button>
    </div>
  );
};

export default DocPage;
