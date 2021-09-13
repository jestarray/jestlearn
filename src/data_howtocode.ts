import { object_without_properties } from "svelte/internal";
import { ProblemSet, Problem, gen_amount } from "./ProblemSet";

function fetch_problems(id: number = 0, amount = 5) {
return async function get_it() {
    //const fetch_url = "http://localhost:3000/exercise";
    const fetch_url = "https://jestlearn.com/exercise";
    let response = await fetch(fetch_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, amount: amount }),
    });
    let result = await response.json();
    return result;
  }
}

/// min and max are inclusive
function ran_int(min = 0, max = 1) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function ran_bool() {
  return ran_int(0, 1) == 1;
}

let racket_math_expressions = new ProblemSet(
  "Expressions and Evaluation with numbers",
  2.0,
  fetch_problems(0, 10),
  [],
  [
    {
      url_title: "article",
      url: "https://jesthowtocode.netlify.app/expressions.html",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);

let infix_to_prefix = new ProblemSet(
  "Translate infix to prefix math",
  2.1,
  fetch_problems(2.1, 10),
  [],
  [
    {
      url_title: "article",
      url: "https://jesthowtocode.netlify.app/expressions.html",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);

let racket_string_practice = new ProblemSet(
  "Zero based indexing string practice",
  2.2,
  gen_amount(10, function gen_problem() {
    let ran_words = [
      "StRiKeBrEaKeR",
      "InVeStIgAtIoN",
      "AlLoCaTiOn",
      "EnViRoNmEnT",
      "CoRrEcTiOn",
      "CoRrEsPoNdEnCe",
      "InVeStMeNt",
      "DeMoCrAtIc",
      "CoNcLuSiOn",
      "MaInStReAm",
      "PoSsIbIlItY",
      "AdMiRaTiOn",
      "InTeLlIgEnCe",
      "DiSaBiLiTy",
      "ExCiTeMeNt",
      "ReAsOnAbLe",
      "InStRuCtIoN",
      "DiScIpLiNe",
      "NeGoTiAtIoN",
      "OpErAtIoNaL",
    ];
    function ran_caps(arr: string[]) {
      return arr.map(function random_caps(val) {
        return val
          .split("")
          .map((letter, index) => {
            if (index % 2 == 0) {
              return letter.toUpperCase();
            } else {
              return letter;
            }
          })
          .reduce((acc, curr) => acc + curr);
      });
    }
    let word: string = pick_random_el(ran_words);
    let start = ran_int(0, word.length - 1);
    let end = ran_int(start, word.length - 1);

    //the answer has to be quoted on the offchance that the string is empty
    let result = new Problem(
      "input",
      `<pre class="line-numbers match-braces rainbow-braces"><code class="language-racket">; what does the following produce?
(substring "${word}" ${start} ${end})</code></pre>`,
      `"${word.substring(start, end)}"`,
      'remember: caps matter, wrap your answer in quotes! e.g: "bOo"'
    );
    return result;
  }),
  [],
  [
    {
      url_title: "article",
      url: "https://jesthowtocode.netlify.app/strings.html",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);

let ran_var_arith = new ProblemSet(
  "Variable arith evaluation",
  2.3,
  fetch_problems(2.3, 10),
  [],
  [
    {
      url_title: "article",
      url: "https://jesthowtocode.netlify.app/expressions.html",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);

let build_a_string = new ProblemSet(
  "Build a string",
  2.4,
  fetch_problems(2.4, 10),
  [],
  [
    {
      url_title: "article",
      url: "https://jesthowtocode.netlify.app/expressions.html",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);

let comparisons = new ProblemSet(
  "If bool comparisons",
  2.5,
  fetch_problems(2.5, 10),
  [],
  [
    {
      url_title: "article",
      url: "https://jesthowtocode.netlify.app/expressions.html",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);

let logical = new ProblemSet(
  "If logical",
  2.6,
  fetch_problems(2.6, 10),
  [],
  [
    {
      url_title: "article",
      url: "https://jesthowtocode.netlify.app/expressions.html",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);

function pick_random_el(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
let all: ProblemSet[] = [racket_math_expressions, infix_to_prefix, racket_string_practice, ran_var_arith, build_a_string, comparisons, logical];
//WARNING: do not stringify this! we need the gen function and a copy of the original questions for resetting and other things
export const TOC_original: ProblemSet[] = all.map((val) => Object.freeze(val));

// we are mutating this
//copy over the gen() functions that got removed because of stringify
export let TOC: ProblemSet[] = JSON.parse(JSON.stringify(all)).map(
  (val, index) => {
    let m1 = Object.assign(val, TOC_original[index]);
    //so we can run has_started() since it deleted the prototype link to the clas :/
    m1.__proto__ = ProblemSet.prototype;
    return m1;
  }
);
//window.toc = TOC;
//the home page of your course will be at https://yourdomain.com/example_course , where example_course is the name of the course(all spaces are replaced by underscores)
export const COURSE_NAME = "how to code"