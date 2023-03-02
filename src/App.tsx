import "./App.css";
import WaterMark from "./components/water-mark";

function App() {
  return (
    <div className="App">
      <WaterMark watermarkContent={{ text: "这是一个水印2" }}>
        <div
          style={{ width: "300px", height: "600px", background: "#ddd" }}
        ></div>
      </WaterMark>
    </div>
  );
}

export default App;
