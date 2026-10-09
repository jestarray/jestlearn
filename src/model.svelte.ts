/**
 * The course data model.
 *
 * This lives in a `.svelte.ts` module so that the classes can use runes. Svelte 5
 * no longer makes class instances deeply reactive the way Svelte 3/4 did at
 * compile time ("classes are no longer auto-reactive"), so every field that the
 * UI reads or writes is declared as a `$state` class field.
 *
 * `$state` class fields compile down to `#private` fields with getters/setters,
 * which means they are *not* own enumerable properties. `toJSON()` is therefore
 * required for `JSON.stringify` (localStorage + the sync server) to keep
 * producing the exact same shape it did before the migration.
 */

export type AnswerOption = {
  text: string;
  correct: boolean;
  explanation?: string;
};

export type Answer = string | number | AnswerOption[];

export type Resource = { url_title: string; url: string; additional: string };

export class Problem {
  type = $state("");
  question = $state("");
  answer = $state<Answer>("");
  input_answer_hint = $state("");
  result = $state("❓");
  tries = $state(0);
  time = $state(0);
  hints = $state(0);

  constructor(
    type: string,
    question: string,
    answer: string | number | AnswerOption[],
    input_answer_hint: string = "",
  ) {
    this.type = type;
    this.question = question;
    this.answer = answer;
    this.input_answer_hint = input_answer_hint;
  }

  toJSON() {
    return {
      type: this.type,
      question: this.question,
      answer: this.answer,
      input_answer_hint: this.input_answer_hint,
      result: this.result,
      tries: this.tries,
      time: this.time,
      hints: this.hints,
    };
  }
}

export class ProblemSet {
  title = $state("");
  ///id is for section identification
  id = $state(0);
  ///the named section this problem set belongs to, e.g "basics". defaulted so
  ///that problem sets which have not been given a section still render.
  section = $state("none");
  problem_index = $state(0);
  tags = $state<string[]>([]);
  // if you are not randomly generating problems, stick them in .problems
  problems = $state<Problem[]>([]);
  //otherwise you are, so provide a function that returns an array of problems, or an async function if you need to fetch from an api
  gen = $state<Function | undefined>(undefined);
  resources = $state<Resource[]>([]); //array of links to theoretical content, additional can be some html though its not recommended because its better to have things open in a new tab rather than needing to keep popping the modal on and off
  emoji_mark = $state("❓");
  last_updated = $state(0);

  constructor(
    title: string,
    id: number,
    gen: Function | undefined,
    problems: Problem[] = [],
    resources: Resource[] = [],
    tags: string[] = [],
    emoji_mark: string = "❓",
    //appended last so that the existing positional call sites stay valid
    section: string = "none",
  ) {
    this.title = title;
    this.id = id;
    this.section = section;
    this.problem_index = 0;
    this.problems = problems;
    this.tags = tags;
    this.gen = gen;
    this.resources = resources;
    this.emoji_mark = emoji_mark;
    this.last_updated = 0;
  }

  toJSON() {
    return {
      title: this.title,
      id: this.id,
      section: this.section,
      problem_index: this.problem_index,
      tags: this.tags,
      problems: this.problems,
      resources: this.resources,
      emoji_mark: this.emoji_mark,
      last_updated: this.last_updated,
    };
  }
}

/**
 * Deep copies a problem set so that working through a course never mutates the
 * original data, while keeping the `gen()` function that JSON.stringify would
 * drop on the floor.
 */
export function clone_problem_set(ps: ProblemSet): ProblemSet {
  let copy = new ProblemSet(
    ps.title,
    ps.id,
    ps.gen,
    JSON.parse(JSON.stringify(ps.problems)),
    JSON.parse(JSON.stringify(ps.resources)),
    [...ps.tags],
    ps.emoji_mark,
    ps.section,
  );
  copy.problem_index = ps.problem_index;
  copy.last_updated = ps.last_updated;
  return copy;
}

export function has_started(problems: Problem[]): boolean {
  for (let i = 0; i < problems.length; i++) {
    if (problems[i].tries >= 1) {
      return true;
    }
  }
  return false;
}

//adds back the props that were lost when the data was serialized (e.g. the gen() function)
export function merge_back_deleted_props(
  without: ProblemSet[],
  original: ProblemSet[],
): ProblemSet[] {
  return without.map((val) => {
    let found = original.find((hay) => val.title === hay.title);
    if (found) {
      val.gen = found.gen;
      val.resources = found.resources;
      val.tags = found.tags;
      //saves written before sections existed have no section, and the server
      //does not persist one, so take it from the current TOC
      val.section = found.section;
      return val;
    } else {
      return val;
    }
  });
}

export function gen_amount(amount = 1, f: () => Problem): () => Problem[] {
  return function g() {
    let res = [];
    for (let i = 0; i < amount; i++) {
      res.push(f());
    }
    return res;
  };
}
