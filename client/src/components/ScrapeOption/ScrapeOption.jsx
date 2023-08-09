import React from "react";

import { useDispatch, useSelector } from 'react-redux';
import { updateBrand, updateDelay, uploadConfig, updateInterception, scraperControl, scraperConfig } from '../../features/scrapeSlice';

import "./ScrapeOption.css";

const ScrapeOption = () => {
    const dispatch = useDispatch();
    const { selectedSite, brand, brands, delay, interception } = useSelector((state) => state.scrape);

    const handleBrandChange = (event) => {
        dispatch(updateBrand(event.target.value));
        dispatch(uploadConfig({ site: selectedSite, brand: event.target.value }));
    }

    const handleBrandRefresh = () => {
        dispatch(scraperControl({ site: selectedSite, action: 'brandRefresh' }));
        dispatch(scraperConfig(selectedSite));
    }

    const handleDelayOnChange = (event) => {
        dispatch(updateDelay({ delayOn: event.target.value, delayTime: delay.delayTime }));
        dispatch(uploadConfig({ site: selectedSite, delayOn: event.target.value }));
    }

    const handleDelayTimeChange = (event) => {
        dispatch(updateDelay({ delayOn: delay.delayOn, delayTime: parseInt(event.target.value) }));
        dispatch(uploadConfig({ site: selectedSite, delayTime: parseInt(event.target.value) }));
    }

    const handleInterceptionChecked = (event) => {    
        dispatch(updateInterception(event.target.checked ? true : false));
        dispatch(uploadConfig({ site: selectedSite, interception: event.target.checked ? true : false }))
    }

    return (
        <div className="scrape-control-options-wrapper">
            <div className="scrape-control-brand-delay">
                <div className="scrape-control-brand-wrapper">
                    <span className="scrape-control-brand-dropdown-heading">Choose Brand</span>
                    <select
                        className="scrape-control-brand-dropdown"
                        value={brand}
                        onChange={(event) => handleBrandChange(event)}
                    >
                        <option value="" disabled hidden defaultValue>Select Brand</option>
                        {
                            brands.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))
                        }
                    </select>
                    <button className="scrape-control-brand-refresh" onClick={handleBrandRefresh}>Refresh Brands</button>
                </div>
                <div className="scrape-control-delay-wrapper">
                    <span className="scrape-control-delay-type-heading">Set Delay</span>
                    <select
                        className="scrape-control-delay-type"
                        value={delay.delayOn}
                        onChange={handleDelayOnChange}
                    >
                        <option value="page">On each Page</option>
                        <option value="item">On each Item</option>
                        <option value="none">None</option>
                    </select>
                    <input
                        className="scrape-control-delay-time"
                        type="number"
                        min="0"
                        placeholder="In seconds"
                        value={delay.delayTime}
                        onChange={handleDelayTimeChange}
                    />
                </div>
            </div>
            <div className="scrape-control-interception">
                <div className="scrape-control-interception-wrapper">
                    <label className="scrape-control-interception">
                        <input type="checkbox"
                            checked={interception}
                            onChange={handleInterceptionChecked}
                        />
                        <span className="checkmark"></span>
                        Request Interception
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ScrapeOption;