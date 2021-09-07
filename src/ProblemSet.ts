export class Problem {
  type: string;
  question: string;
  answer: string | number | { text: string; correct: boolean }[]; //todo: should probably be an array of strings for multi-answer input
  input_answer_hint: string;
  result: string;
  tries: number;
  time: number;
  hints: number;
  constructor(
    type: string,
    question: string,
    answer:
      | string
      | number
      | { text: string; correct: boolean; explanation: string }[],
    input_answer_hint: string = ""
  ) {
    this.type = type;
    this.question = question;
    this.answer = answer;
    this.input_answer_hint = input_answer_hint;
    this.result = "❓";
    this.tries = 0;
    this.time = 0;
    this.hints = 0;
  }
}

export class ProblemSet {
  title: string;
  ///ids must be unique!
  id: number;
  problem_index: number;
  tags: string[];
  // if you are not randomly generating problems, stick them in .problems
  problems: Problem[];
  //otherwise you are, so provide a function that returns an array of problems, or an async function if you need to fetch from an api
  gen: Function | undefined;
  resources: { url_title: string; url: string; additional: string }[]; //ray of links to theoretical content, additional can be some html though its not recommended because its better to have things open in a new tab rather than needing to keep popping the modal on and off
  emoji_mark: string;
  last_updated: number;
  constructor(
    title: string,
    id: number,
    tags: string[],
    gen: Function | undefined,
    problems: Problem[] = [],
    resources: { url_title: string; url: string; additional: string }[] = [],
    emoji_mark: string = "❓"
  ) {
    this.title = title;
    this.id = id;
    this.problem_index = 0;
    this.problems = problems;
    this.tags = tags;
    this.gen = gen;
    this.resources = resources;
    this.emoji_mark = emoji_mark;
    this.last_updated = 0;
  }
}
export function has_started(problems: Problem[]): boolean {
  for (let i = 0; i < problems.length; i++) {
    if (problems[i].tries >= 1) {
      return true;
    }
  }
  return false;
}

//adds back the gen() functions that were not seralized
export function merge_back_deleted_props(without: ProblemSet[], original: ProblemSet[]): ProblemSet[] {
  return without.map((val) => {
    let found = original.find((hay) => val.id === hay.id);
    if(found) {
      val.gen = found.gen;
      val.resources = found.resources;
      val.tags = found.tags;
      return val;
    } else {
      return val;
    }
  })
}

export function gen_amount(amount = 1, f: () => Problem): () => Problem[] {
  return function g() {
    let res = [];
    for(let i = 0; i < amount; i++){
      res.push(f());
    }
    return res;
  };
}
