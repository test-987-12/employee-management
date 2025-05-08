import {Outlet} from 'react-router-dom'
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Pages/Footer';

const Main = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />
            <main className='flex-grow max-w-screen-xl w-full mx-auto'>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Main;