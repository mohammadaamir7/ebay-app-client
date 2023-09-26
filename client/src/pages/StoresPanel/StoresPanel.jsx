import React from "react";

import StoresTable from '../../components/StoresTable/StoresTable';

import "./StoresPanel.css";

const Panel = () => {
	return (
		<div className="panel-wrapper">
			<div className="panel-header">
				<div className="panel-heading">
					<h2>Management Panel</h2>
				</div>
			</div>
			<div className="management-panel">
				<StoresTable />
			</div>
		</div>
	);
};

export default Panel;
