import './Header.css';
import userPhoto from './wtf.png'; // Файл лежит в той же папке, что и Header.jsx

export const Header = () => {
    return (
        <header className="header">
            <img
                src={userPhoto}
                alt="User"
                className="user-photo"
            />
        </header>
    );
}