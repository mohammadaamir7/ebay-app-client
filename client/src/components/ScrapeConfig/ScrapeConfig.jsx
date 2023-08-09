import { useState, useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { updateConfig, uploadConfig } from '../../features/scrapeSlice';

import "./ScrapeConfig.css";

import ScrapeOption from '../ScrapeOption/ScrapeOption';

const ScrapeConfig = () => {
    const dispatch = useDispatch();
    const { selectedSite, scraperConfig } = useSelector((state) => state.scrape);

    const [scraperConfigValue, setScraperConfigValue] = useState('');

    useEffect(() => {
        setScraperConfigValue(scraperConfig);
    }, [scraperConfig]);

    const handleTextareaChange = (event) => {
        setScraperConfigValue(event.target.value);
    };

    const handleConfigSave = () => {
        dispatch(updateConfig(scraperConfigValue));
        dispatch(uploadConfig({ site: selectedSite, scraperConfig: JSON.parse(scraperConfigValue) }));
    };

    return (
        <div className="scrape-control-config-wrapper">
            <div className="scrape-control-config-head">
                <span className="scrape-control-config-heading">Configuration File</span>
                {
                    selectedSite && <button
                        className="scrape-control-config-save-btn"
                        onClick={handleConfigSave}
                    >
                        Save
                    </button>
                }
            </div>
            <textarea
                className="scrape-control-config-area"
                value={scraperConfigValue}
                onChange={handleTextareaChange}
            ></textarea>
            <ScrapeOption />
        </div>
    );
};

export default ScrapeConfig;
