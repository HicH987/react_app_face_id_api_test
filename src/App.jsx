import axios from "axios";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [faceName, setFaceName] = useState(null);
  const [isUnknown, setIsUnknown] = useState(null);

  // ----------------------------------------------
  const [textInput, setTextInput] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(
      "http://127.0.0.1:5000/api/add-face-name",
      { textInput }
    );
    setFaceName(textInput);
    setImage(null);
    setIsUnknown(false)
    console.log(response.data);
  };

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };
  // -------------------------------------------------

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };
  const upload = async () => {
    const formData = new FormData();
    formData.append("image", dataURItoBlob(image));
    const response = await axios.post(
      "http://127.0.0.1:5000/api/face-identification",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    setFaceName(response.data.name);
    if (response.data.name === "Unknown_face")
      setIsUnknown(true)
      else {

        setIsUnknown(false)
        setImage(null);
      }
  };
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="container">
      <h3>
        Face name: <strong>{faceName}</strong>
      </h3>

      {!image && (
        <div>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <br />
          <button onClick={capture}>Capture</button>
        </div>
      )}

      {image && <img src={image} alt="captured" />}
      {image && !isUnknown && (
        <div>
          <br />
          <button onClick={upload}>Upload</button>
        </div>
      )}
      {image && isUnknown && (
        <form onSubmit={handleSubmit}>
          <input type="text" value={textInput} onChange={handleInputChange} />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default App;
