import { SolutionsHero } from "./SolutionsHero";
import { SolutionsList } from "./SolutionsList";
import { SolutionsProcess } from "./SolutionsProcess";
import { SolutionsCTA } from "./SolutionsCTA";

export function SolutionsPage() {
    return (
        <div className="min-h-screen bg-white">
            <SolutionsHero />
            <SolutionsList />
            <SolutionsProcess />
            <SolutionsCTA />
        </div>
    );
}

export default SolutionsPage;
