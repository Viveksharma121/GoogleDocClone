import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import DocAccessReq from "./components/Dashboard/DocumentPage/AccessDenied/DocAccess";
import DocPage from "./components/Dashboard/DocumentPage/DocPage";
import Main from "./components/Dashboard/Main";
import LoginPage from "./components/UserAuth/Login";
import RegistrationPage from "./components/UserAuth/Reg";
// import Profile from "./components/UserProfile/Profile";
function App() {
  const [docId, setdocId] = useState(uuidv4());
  const generateDocId = () => {
    const generatedDocId = uuidv4();
    setdocId(generatedDocId);
    return generatedDocId;
  };
  console.log(docId);
  return (
    <div className="App">
      {/* <Profile /> */}

      {/* <LoginPage /> */}
      {/* <Main /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<Main docId={docId} />} />
          <Route
            path="/doc/:docId"
            element={<DocPage generatedDocId={generateDocId} />}
          />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/access-denied/:docId" element={<DocAccessReq />} />
          {/* <RegistrationPage /> */}
        </Routes>
        {/*
          <button onClick={handleGiveAccess}>Go to DocPage</button>
        */}
      </BrowserRouter>
      {/* <Modal /> */}
    </div>
  );
}

export default App;
