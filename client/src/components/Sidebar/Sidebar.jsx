import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

import ScraperIcon from '../../assets/sidebar/scraper-icon.png';
import DataPanelIcon from '../../assets/sidebar/data-panel-icon.png';
import SettingsIcon from '../../assets/sidebar/settings-icon.png';

const Sidebar = () => {
	const navigate = useNavigate();

	const handleSignOut = () => {
		localStorage.removeItem('token');
		navigate('/sign-in');
	}

	return (
		<div className="sidebar">
			<div className="nav-option links-options">
				<ul className="nav-options-links">
					<li>
						<Link to="/scrape">
							<img src={ScraperIcon} className="icon" alt="Scrapers" />
						</Link>
					</li>
					<li>
						<Link to="/panel">
							<img src={DataPanelIcon} className="icon" alt="Data Panel" />
						</Link>
					</li>
				</ul>
			</div>
			<div className="nav-option profile-options">
				<div className="settings-btn">
					<img src={SettingsIcon} className="settings" alt="Settings" />
					<div className="settings-menu">
						<Link to="/profile" className="settings-menu-item top-item">Profile</Link>
						<button className="settings-menu-item bottom-item" onClick={handleSignOut}>Sign Out</button>
					</div>
				</div>
				<div className="avatar">U</div>
			</div>
		</div>
	);
};

export default Sidebar;
