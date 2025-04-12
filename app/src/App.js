import "./App.css";
import Form from "./views/Form/form"
import Config from "./views/Config"
import axios from "axios";

function App() {
  if (process.env.REACT_APP_MODE === "dev") {
    axios.defaults.baseURL = Config.LOCAL_DEV_NODE_URL;
  }
  return (
    <div className="App">
      <Form />
    </div>
  );
}

export default App;
