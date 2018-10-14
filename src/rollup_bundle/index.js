import { sample } from "lodash";
import names from "./lib";

const name = __dirname.sample(names);

// BEGIN-INTERNAL
// This is a secret internal-only comment
console.log(name);
// END-INTERNAL

export default name;
