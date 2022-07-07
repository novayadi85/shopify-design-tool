import React from "react";
import { connect } from "react-redux";

const style = {
  height: "300px",
  color: "#666",
  tabSize: 4,
  overflow: "auto",
  padding: "10px",
  border: "1px solid #e5e5e5",
  borderRadius: "3px",
  background: "#eee"
};

const CurrentStore = props => (
  <div style={{ marginTop: 30 }}>
    <h4>Current Form State:</h4>
    <pre style={style}>
      <code>{JSON.stringify(props, null, 2)}</code>
    </pre>
  </div>
);

export default connect(state => ({
  form: state.form
}))(CurrentStore);
