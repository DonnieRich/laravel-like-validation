import Between from "../rules/Between.js";
import PresentIf from "../rules/PresentIf.js";

class Rule {

    static present_if() {
        return new PresentIf();
    }

    static between() {
        return new Between();
    }

}

export default Rule;