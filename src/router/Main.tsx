import Header from '../components/shared/Header/Header';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useGetCurrentUserQuery } from '../redux/api/authApi/authApi';

const Main = () => {
    const accessToken = Cookies.get('accessToken')
    useGetCurrentUserQuery(undefined, { skip: !accessToken });

    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};

export default Main;