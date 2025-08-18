import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header/Header';


const DashboardLayout = () => {

    return (
        <div className="dashboard-layout  flex flex-col border">
            <Header />
                <div className='relative h-[93vh] w-full flex'>
                    <div className="sidebar h-full w-1/4 p-4 bg-gray-200">
                        <h2 className='text-lg font-bold text-center border-b'>Sidebar</h2>
                        <ul>
                            <li className='mb-2 bg-secondary p-2 rounded'>
                                <Link to="/dashboard">Home</Link>
                        </li>
                        <li className='mb-2 bg-secondary p-2 rounded'>
                            <Link to="/dashboard/users">Users</Link>
                        </li>
                        <li className='mb-2 bg-secondary p-2 rounded'>
                            <Link to="/dashboard/questions">Questions</Link>
                        </li>
                    </ul>
                </div>
                <div className="w-3/4 px-10 lg:px-20 min-h-full mt-10 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;