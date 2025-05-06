import './ButtonMore.css';

export const ButtonMore = ({ onFetchNew, isLoading }) => {
    return (
        <button
            className="more-button"
            onClick={onFetchNew}
            disabled={isLoading}
        >
            {isLoading ? 'Загрузка...' : 'ЕЩЁ'}
        </button>
    );
};