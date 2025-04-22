import { Outlet } from 'react-router-dom';
import './AppLayout.css';
import { Header } from '../components/Header/Header';

export const AppLayout = () => {
    return (
        <>
            <Header />
            <main className="main" id="yo">
                <Outlet />
            </main>
        </>
    )
}