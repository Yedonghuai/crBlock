import React from "react";
import { start } from "../../blockly/utils";

class Block extends React.Component {
  componentDidMount() {
    start();
  }
  render() {
    return <div id="blocklyDiv"></div>;
  }
}

export default Block;
