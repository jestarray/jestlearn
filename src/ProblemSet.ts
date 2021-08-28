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
    this.result = "?";
    this.tries = 0;
    this.time = 0;
    this.hints = 0;
    /* type: "input",
        question: `<h2>Convert ${subscript(binary, 2)} to hex?</h2>`,
        answer: "0x" + hex,
        input_answer_hint: "prefix with '0x', example: 0xbfa11", */
  }
}

export class ProblemSet {
  title: string;
  id: number;
  problem_index: number;
  num_of_problems: number;
  tags: string[];
  //if you aren't generating problems, stick it in the data field
  problems: Problem[];
  gen: Function | undefined;
  resources: { url_title: string; url: string, additional: string}[]; //ray of links to theoretical content, additional can be some html though its not recommended because its better to have things open in a new tab rather than needing to keep popping the modal on and off
  emoji_mark: string;
  last_updated: number;
  constructor(
    title: string,
    id: number,
    num_of_problems: number = 1,
    tags: string[],
    gen: Function | undefined,
    problems: Problem[] = [],
    resources: { url_title: string; url: string, additional: string}[] = [],
    emoji_mark: string = "❓"
  ) {
    this.title = title;
    this.id = id;
    this.problem_index = 0;
    this.problems = problems;
    if (problems.length > 0) {
      this.num_of_problems = problems.length;
    } else {
      this.num_of_problems = num_of_problems;
    }
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
