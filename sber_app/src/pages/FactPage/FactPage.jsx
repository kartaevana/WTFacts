import { ButtonMore } from './components/ButtonMore/ButtonMore';
import { FactCard } from './components/FactCard/FactCard';
import './FactPage.css';

export const FactPage = () => {
    return (
        <div class="fact-page">
            <FactCard/>
            <ButtonMore/>
        </div>
    )
}