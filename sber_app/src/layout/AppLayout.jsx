import { Outlet } from 'react-router-dom';
import './AppLayout.css';
import { Header } from '../components/Header/Header.jsx';

export const AppLayout = () => {
    return (
        <>руфвук
            <Header />
            <main className="main" id="yo">
                <Outlet />
            </main>
        </>
    )
}