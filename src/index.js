import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SearchBar from "./SearchBar";
import SongPage from "./SongPage";

import "./index.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={SearchBar} />
          <Route path="/SongPage" exact component={SongPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
