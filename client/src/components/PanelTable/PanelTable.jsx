import React, {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from 'react-router-dom';

import {useSelector, useDispatch} from 'react-redux';
import {
    getitemInfo,
    getConfigInfo,
    getSearchInfo,
    updateFilter,
    updateItemEditPageActive
} from '../../features/panelSlice';

import "./PanelTable.css";

const limit = 10;

const PanelTable = () => {
    const dispatch = useDispatch();
    const {
        pageItems,
        totalpages,
        sites,
        selectedSite,
        selectedBrand,
        searchTerm,
        searchStatus,
        itemEditPageActive
    } = useSelector(state => state.panel);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getConfigInfo());
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            handleSearch();
        } else {
            dispatch(getitemInfo({page: currentPage, limit: limit}));
        }
    }, [currentPage]);

    const navigate = useNavigate();

    const handlePage = (event) => {
        const direction = event.target.value;

        if (direction === 'next' && totalpages > 0) {
            setCurrentPage(prevPage => prevPage + 1);
        } else if (direction === 'previous' && currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleFilterChange = (event, filter) => {
        dispatch(updateFilter({value: event.target.value, filter}));
    }

    const handleSearch = () => {
        dispatch(getSearchInfo({
            term: searchTerm,
            site: selectedSite,
            brand: selectedBrand,
            page: currentPage,
            limit: limit
        }));
    }

    const handleItemEditBtn = (item) => {
        dispatch(updateItemEditPageActive(item));
        navigate('/item-edit');
    }

    return (
        <div className="panel-table">
            <div className="panel-data-control">
                <div className="panel-table-search">
                    <input
                        type="text"
                        className="panel-data-control-search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(event) => handleFilterChange(event, 'term')}
                    />
                </div>
                <div className="panel-table-control">
                    <div className="panel-table-filter">
                        <select
                            className="panel-site-selector"
                            value={selectedSite}
                            onChange={(event) => handleFilterChange(event, 'site')}
                        >
                            <option value="" hidden defaultChecked>Choose Site</option>
                            <option value="">None</option>
                            {
                                sites && sites.map((obj) => {
                                    return (
                                        <option key={obj.site} value={obj.site}>{obj.site}</option>
                                    )
                                })
                            }
                        </select>
                        <select
                            className="panel-brand-selector"
                            value={selectedBrand}
                            onChange={(event) => handleFilterChange(event, 'brand')}
                        >
                            <option value="" hidden defaultChecked>Choose Brand</option>
                            <option value="">None</option>
                            {
                                sites && (
                                    sites.map((obj) => {
                                        if (selectedSite && obj.site !== selectedSite) {
                                            return null;
                                        }
                                        return obj.brands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ));
                                    })
                                )
                            }

                        </select>
                        <div className="panel-price-selector">
                            <input type="number" className="panel-data-control-price" placeholder="Min Price"/>
                            <input type="number" className="panel-data-control-price" placeholder="Max Price"/>
                        </div>
                    </div>
                    <div className="panel-table-search-btn">
                        <div className="panel-search">
                            <button className="panel-search-btn" onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                </div>
                <span>{searchStatus}</span>
            </div>
            <div className="panel-data-table-control">
                <table className="panel-data-table">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Image</th>
                        <th>Site</th>
                        <th>brand</th>
                        <th>Item Number</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {pageItems.map(item => (
                        <tr key={item._id}>
                            <td><input type="checkbox" name="" id=""/></td>
                            <td>
                                {/* <img className="table-item-img" src={item.imageUrl} alt={item.productName} /> */}
                            </td>
                            <td>{item.site}</td>
                            <td>{item.brand}</td>
                            <td>{item.itemNumber}</td>
                            <td>{item.productName}</td>
                            <td>{item.price}</td>
                            <td>{item.availableUnits}</td>
                            <td className="table-item-setting">
                                <Link className="table-item-edit-btn" to={'/item-edit/' + item._id}>
                                    <i className="fi fi-rr-pencil"></i>
                                </Link>
                                <button className="table-item-info-btn">
                                    <i className="fi fi-bs-menu-dots-vertical"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="panel-page-control-wrapper">
                    <span>{currentPage} of {totalpages}</span>
                    <button className="panel-page-control-btn" value="previous" onClick={handlePage}>
                        <i className="fi fi-br-angle-left"></i>
                    </button>
                    <button className="panel-page-control-btn" value="next" onClick={handlePage}>
                        <i className="fi fi-br-angle-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PanelTable;