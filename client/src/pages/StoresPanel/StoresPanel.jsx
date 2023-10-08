import React from "react";

import StoresTable from '../../components/StoresTable/StoresTable';

import "./StoresPanel.css";

const Panel = () => {
	return (
		<div className="panel-wrapper">
			<div className="management-panel">
				<StoresTable />
			</div>
		</div>
	);
};

export default Panel;
