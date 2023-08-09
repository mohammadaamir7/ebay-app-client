import React from "react";

import PanelTable from '../../components/PanelTable/PanelTable';

import "./Panel.css";

const Panel = () => {
	return (
		<div className="panel-wrapper">
			<div className="panel-header">
				<div className="panel-heading">
					<h2>Management Panel</h2>
				</div>
			</div>
			<div className="management-panel">
				<PanelTable />
			</div>
		</div>
	);
};

export default Panel;
