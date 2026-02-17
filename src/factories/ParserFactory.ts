import RuleParser from "../strategies/RuleParser.js";

class ParserFactory {
    static make() {
        return new RuleParser();
    }
}

export default ParserFactory;