import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home_container">
            <p className="home_text">WTFacts</p>
            <button onClick={() => navigate(`/fact/`)} className="wtfacts-reveal-btn" id="revealFactBtn">
                Расскажи что-то интересное
            </button>
        </div>
    );
}
