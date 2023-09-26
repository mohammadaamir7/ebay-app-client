import React from "react";

import EbayItemsTable from '../../components/EbayItemsTable/EbayItemsTable';

import "./EbayPanel.css";

const Panel = () => {
	return (
		<div className="panel-wrapper">
			<div className="panel-header">
				<div className="panel-heading">
					<h2>Management Panel</h2>
				</div>
			</div>
			<div className="management-panel">
				<EbayItemsTable />
			</div>
		</div>
	);
};

export default Panel;
