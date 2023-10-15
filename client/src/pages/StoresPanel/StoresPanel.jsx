import React from "react";

import StoresTable from "../../components/StoresTable/StoresTable";

import "./StoresPanel.css";

const Panel = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <StoresTable />
        </div>
      </div>
    </div>
    // <div className="panel-wrapper">
    // 	<div className="management-panel">
    // 		<StoresTable />
    // 	</div>
    // </div>
  );
};

export default Panel;
