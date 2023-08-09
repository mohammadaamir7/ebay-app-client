import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const ProtectedEdit = () => {
    const dispatch = useDispatch();
    const { itemEditPageActive } = useSelector(state => state.panel);
    
    const location = useLocation();

    if (!itemEditPageActive) {
        return <Navigate to="/panel" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedEdit;