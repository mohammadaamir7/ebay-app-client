import { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { scraperControl, updateAction } from '../../features/scrapeSlice';

import RunTime from './RunTime';

import "./ScrapeStatus.css";

import controlPlay from '../../assets/scrapeStatus/icons/control-play.png';
import controlPause from '../../assets/scrapeStatus/icons/control-pause.png';
import controlStop from '../../assets/scrapeStatus/icons/control-stop.png';

const ScrapeStatus = () => {
    const dispatch = useDispatch();
    const { selectedSite, scraperStatus, action } = useSelector((state) => state.scrape);

    useEffect(() => {
        console.log(scraperStatus)
    }, [scraperStatus]);

    const handleScraperControl = (action) => {
        dispatch(scraperControl({ site: selectedSite, action }));
        dispatch(updateAction(action));
    }

    return (
        <div className="scrape-control-status-wrapper">
            <div className="scrape-control-status">
                <div className="scrape-control-status-page">
                    <span>Pages Scraped</span>
                    <span>{scraperStatus.pages}</span>
                </div>
                <div className="scrape-control-status-item">
                    <span>Products Scraped</span>
                    <span>{scraperStatus.items}</span>
                </div>
                <div className="scrape-control-status-time">
                    <span>Run Time</span>
                    <RunTime
                        action={action}
                    />
                </div>
            </div>
            <div className="scrape-main-control-wrapper">
                <div className="scrape-main-control-status">
                    <span>{scraperStatus.text}</span>
                </div>
                <div className="scrape-main-control-btn">
                    <button className="scrape-main-control-start" onClick={() => handleScraperControl('start')}>
                        <img src={controlPlay} alt="start" />
                    </button>
                    <button className="scrape-main-control-pause" onClick={() => handleScraperControl('pause')}>
                        <img src={controlPause} alt="pause" />
                    </button>
                    <button className="scrape-main-control-stop" onClick={() => handleScraperControl('stop')}>
                        <img src={controlStop} alt="stop" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScrapeStatus;