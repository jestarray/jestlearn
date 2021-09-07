import { ProblemSet, Problem } from "./ProblemSet";

let e_choice = new Problem(
  "select",
  "Which of the following statements are true about computers",
  [
    { text: "computers use 0 and 1s", correct: true, explanation: "" },
    {
      text: "computers were invented in the stone era",
      correct: false,
      explanation: "",
    },
    { text: "computers use electricity", correct: true, explanation: "" },
  ],
  "hinty"
);

let e_choice2 = new Problem(
  "select",
  "Which of the following statements are false about water?",
  [
    {
      text: "water is abbreviated h2o in chemistry",
      correct: false,
      explanation: "<i>Yes but that is not what the question is asking</i>",
    },
    {
      text: "water is not necssary for human survival",
      correct: true,
      explanation: "",
    },
    {
      text: "most plants do not need water to survive",
      correct: true,
      explanation: "",
    },
  ],
  "hinty"
);

let e_choice_code = new Problem(
  "select",
  `<pre class="line-numbers match-braces rainbow-braces"><code class="language-racket">
; What is the next stemp in the evaluation order?: 
(+ 1 3 (* 50 3))
</code></pre>`,
  [
    {
      text: `<pre class="line-numbers match-braces rainbow-braces"><code class="language-racket">
(+ 1 3 (* 150))
</code></pre>`,
      correct: true,
      explanation:
        "Good job! We look to the most inward parens and evaluate that one first.",
    },
    {
      text: `<pre class="line-numbers match-braces rainbow-braces"><code class="language-racket">
(+ 4 (* 50 3))
</code></pre>`,
      correct: false,
      explanation:
        "from left to right, find the most inward parens and evaluate it",
    },
  ]
);

let example_multi_choice = new ProblemSet(
  "Example Multi Choice",
  1,
  ["tag1", "tag2"],
  undefined,
  [e_choice, e_choice2, e_choice_code],
  [
    { url_title: "📄 articles", url: "https://google.com", additional: "" },
    { url_title: "🎥 video", url: "https://youtube.com", additional: "" },
  ]
);

// min and max are inclusive
function ran_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function ran_bool() {
  return (ran_int(0, 1) == 1);
}

let example_generate = new ProblemSet(
  "Example Input RanGen: Binary To Decimal",
  2.0,
  ["additionalsearcheterms", "convert"],
  function generate_binary_to_decimal(amount = 5) {
    function normalize_bwidth(num, width) {
      // zero shift right converts the number to a signed 32 bit number?
      let binary = (num >>> 0).toString(2);
      if (binary.length < width) {
        //pad with 0s
        return binary.padStart(width, "0");
      } else if (binary.length > width) {
        return binary.slice(-width);
      } else if (binary.length == width) {
        return binary;
      } else {
        console.warn(
          "WARNING! CHECK TO MAKE SURE THE BIT-WIDTH FITS WITHIN NUM RANGE"
        );
        return binary;
      }
    }
    function subscript(string, base) {
      return `${string}<sub>${base}</sub>`;
    }
    let num = ran_int(0, 255);
    let binary = normalize_bwidth(num, 8);
    return Array(amount).fill(new Problem(
      "input",
      `<h2>Convert ${subscript(binary, 2)} to decimal?</h2>`,
      parseInt(binary, 2).toString(),
      "Answer ex: 3"
    ));
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

let example_rest_api = new ProblemSet(
  "Racket Expressions",
  3.0,
  ["additionalsearcheterms", "convert"],
  async function get_it() {
    let id = 0;
    let amount = 5;
    let response = await fetch("http://jestlearn.com/exercise", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({"id": id, "amount": amount})
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

function pick_random_el(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
let all: ProblemSet[] = [
  example_multi_choice,
  example_generate,
  example_rest_api,
];
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
export const COURSE_NAME = "example course";