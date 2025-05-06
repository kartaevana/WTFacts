import './FactCard.css';
import emoji_img from "../../../../assets/jpg/fa6-regular_face-surprise.png"

export const FactCard = ({ fact }) => {
    if (!fact) return null;

    return (
        <div className="fact-card">
            <div className="fact-header">
                <img className="fact-card__face" src={emoji_img} alt="Удивленное лицо" />
                <h2 className="fact-name">{fact.name}</h2>
            </div>
            <p className="fact-text">{fact.fact}</p>
        </div>
    )
}