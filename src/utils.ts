import { COURSE_NAME } from "./data";
import type { ProblemSet } from "./ProblemSet";

///replace spaces with underscores and lower cases the name
export function convert_to_hash(st: string): string {
  let regex = / /gi;
  let replace_spaces = st.replace(regex, "_");
  let res = replace_spaces.toLowerCase();
  return res;
}

export enum Sync {
  UPDATE = 0,
  INITIAL = 1,
  ARCHIVE = 2,
}

export function diff_latest(set_a: ProblemSet[], set_b: ProblemSet[]) {
  let bigger = set_a;
  let smaller = set_b;
  if (set_a.length < set_b.length) {
    bigger = set_b;
    smaller = set_a;
  }
  //merge the unique ones that the other doesnt have
  for (const item of smaller) {
    let is_unique = true;
    for (const item2 of bigger) {
      if (item.id === item2.id || item.title === item2.title) {
        is_unique = false;
        break;
      }
    }
    if (is_unique) {
      bigger.push(item);
    }
  }
  //diffing
  let diffed = bigger.map((val) => {
    let keep = val;
    for (const val2 of smaller) {
      if (val.id == val2.id && val.last_updated < val2.last_updated) {
        keep = val2;
        break;
      }
    }
    return keep;
  });
  return diffed;
}

const website_sync_point = "https://jestlearn.com/sync";
//const website_sync_point = "http://localhost:3000/sync";
export async function send_sync(username, TOC, server_copy = [], code = 0):Promise<any> {
  let dlatest = diff_latest(TOC, server_copy);
  let send = {
    code: code,
    course_name: COURSE_NAME,
    username: username,
    problem_sets: dlatest
      .filter((val, index) => {
        let serv = server_copy.find((i) => i.id === val.id);
        let update_server_sync = false;
        if (serv) {
          update_server_sync = serv.last_updated < val.last_updated;
        } else if (val.last_updated !== 0) {
          //does not exist on the server yet, but only send if they edited it
          update_server_sync = true;
        }
        //only sync when server data is older than then one here on the client
        return update_server_sync;
      })
      .map((pset) => {
        //no need to send tags& resources, mainly just problem data:
        //have to deep clone
        let clone = JSON.parse(JSON.stringify(pset));
        delete clone.resources;
        delete clone.tags;
        clone.problems = clone.problems.map((problem) => {
          // keep input_answer_hints and explanations because they might be procedurally generated explanations
          //delete problem.input_answer_hint;
          if (Array.isArray(problem.answer)) {
            problem.answer = problem.answer.map((answ) => {
              //delete answ.explanation;
              return answ;
            });
          }
          return problem;
        });
        return clone;
      }),
  };
  ///console.log(send);
  let response = await fetch(website_sync_point, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(send),
  });
  return response.json();
}
