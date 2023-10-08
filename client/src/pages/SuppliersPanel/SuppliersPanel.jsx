import React from "react";

import SuppliersTable from '../../components/SuppliersTable/SuppliersTable';

import "./SuppliersPanel.css";

const Panel = () => {
	return (
		<div className="panel-wrapper">
			<div className="management-panel">
				<SuppliersTable />
			</div>
		</div>
	);
};

export default Panel;
