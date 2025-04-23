import './HomePage.css';

export const HomePage = () => {
    return (
        <div className="home_container">
            <p className="home_text">WTFacts</p>
            <button className="wtfacts-reveal-btn" id="revealFactBtn">
                Расскажи что-то интересное
            </button>
        </div>
    );
}