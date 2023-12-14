import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import DocPage from "./components/Dashboard/DocumentPage/DocPage";
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
      <BrowserRouter>
        <Routes>
          <Route
            path="/doc/:docId"
            element={<DocPage generatedDocId={generateDocId} />}
          />
        </Routes>
        <Link to={`/doc/${docId}`}>
          <button>Go to DocPage</button>
        </Link>
      </BrowserRouter>
      {/* <Modal /> */}
    </div>
  );
}

export default App;
