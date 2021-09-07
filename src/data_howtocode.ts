import { ProblemSet, Problem, gen_amount } from "./ProblemSet";
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
  "Expressions, Numbers, and Evaluation",
  2.0,
  [],
  async function get_it() {
    let id = 0;
    let amount = 5;
    let response = await fetch("http://jestlearn.com/exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, amount: amount }),
    });
    let result = await response.json();
    return result;
  },
  [],
  [
    {
      url_title: "article",
      url: "https://computers404.netlify.app/06-binarynumbers",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);

let racket_string_practice = new ProblemSet(
  "Zero based indexing string practice",
  2.2,
  [],
  gen_amount(10, function get_it() {
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
      url: "https://computers404.netlify.app/06-binarynumbers",
      additional: "",
    },
    { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
  ]
);


function pick_random_el(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
let all: ProblemSet[] = [racket_math_expressions, racket_string_practice];
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
export const COURSE_NAME = "how to code";
