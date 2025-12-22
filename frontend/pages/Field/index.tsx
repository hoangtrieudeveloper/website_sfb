
import { FieldHero } from "./FieldHero";
import { FieldList } from "./FieldList";
import { FieldProcess } from "./FieldProcess";
import { Consult } from "../../components/public/Consult";

export function FieldPage() {
    return (
        <div className="min-h-screen">
            <FieldHero />
            <FieldList />
            <FieldProcess />
            <Consult />
        </div>
    );
}

export default FieldPage;
