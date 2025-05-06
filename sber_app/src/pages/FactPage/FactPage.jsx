import { useState, useEffect } from 'react';
import { ButtonMore } from './components/ButtonMore/ButtonMore';
import { FactCard } from './components/FactCard/FactCard';
import './FactPage.css';

export const FactPage = () => {
    const [currentFact, setCurrentFact] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFact = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/facts/random');
            if (!response.ok) throw new Error('Ошибка сервера');
            const fact = await response.json();
            setCurrentFact(fact);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Загружаем факт при монтировании компонента
    useEffect(() => {
        fetchFact();
    }, []);

    return (
        <div className="fact-page">
            {isLoading ? (
                <div>Загрузка...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <>
                    <FactCard fact={currentFact} />
                    <ButtonMore onFetchNew={fetchFact} isLoading={isLoading} />
                </>
            )}
        </div>
    )
}