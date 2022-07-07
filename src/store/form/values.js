import React from "react";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";

const style = {
  height: "195px",
  color: "#666",
  tabSize: 4,
  overflow: "auto",
  padding: "10px",
  border: "1px solid #e5e5e5",
  borderRadius: "3px",
  background: "#eee"
};

const CurrentFormValues = props => (
  <div style={{ marginTop: 30 }}>
    <h4>Current Form Values:</h4>
    <pre style={style}>
      <code>{JSON.stringify(props, null, 2)}</code>
    </pre>
  </div>
);

export default connect(state => ({
  values: getFormValues("selectingFormValues")(state)
}))(CurrentFormValues);
