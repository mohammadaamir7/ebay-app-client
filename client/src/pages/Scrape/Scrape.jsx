import { useState, useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { scrapersAvailable, updateSite, scraperConfig } from '../../features/scrapeSlice';

import "./Scrape.css";

import ScrapeConfig from '../../components/ScrapeConfig/ScrapeConfig';
import ScrapeStatus from '../../components/ScrapeStatus/ScrapeStatus';

const Scrape = () => {
	const dispatch = useDispatch();
	const { scrapers, selectedSite, uploadStatus } = useSelector((state) => state.scrape);

	const [status, setStatus] = useState('');

	useEffect(() => {
		dispatch(scrapersAvailable());
		dispatch(updateSite('volutone'));
		dispatch(scraperConfig('volutone'));
	}, []);

	useEffect(() => {
		if (uploadStatus === 'Saved') {
			setStatus(uploadStatus);

			setTimeout(() => {
				setStatus('');
			}, 5000);
		} else {
			setStatus(uploadStatus);
		}
	}, [uploadStatus]);

	const handleSiteChange = (event) => {
		dispatch(updateSite(event.target.value));
		dispatch(scraperConfig(event.target.value));
	}

	return (
		<div className="scrape-wrapper">
			<div className="scrape-header">
				<div className="scrape-heading">
					<h2>Scraper Management</h2>
					{status && <div>{status}</div>}
				</div>
				<div className="scraper-dropdown-option-wrapper">
					<select
						className="scraper-dropdown-option"
						value={selectedSite}
						onChange={(event) => handleSiteChange(event)}
					>
						{/* <option value="" disabled hidden defaultValue>Select Site</option> */}
						{
							scrapers.map((option, index) => (
								<option key={index} value={option}>
									{option.charAt(0).toUpperCase() + option.slice(1)}
								</option>
							))
						}
					</select>
				</div>
			</div>
			<div className="scrape-control-panel">
				<div className="scrape-control-wrapper">
					<ScrapeConfig />
					<ScrapeStatus />
				</div>
			</div>
		</div>
	);
};

export default Scrape;
