import { COURSE_NAME } from "./data";

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
  ARCHIVE = 2
}

export function diff_latest(set_a, set_b) {
	let combined = [...set_a, ...set_b];
	let diffmerged = combined.filter((val1, index) => {
		let f = combined.filter((val2, index2) => {
			return index !== index2 && val1.id === val2.id
		});
		if(f.length > 0) {
			return val1.last_updated > f[0].last_updated;
		} else if(f.length === 0) {
			//is unqiue so we keep it?
			return true;
		} else {
			return false;
		}
	});
	return diffmerged.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      } else {
        return 0;
      }
    });
}

const website_sync_point = "https://jestlearn.com/sync"
//const website_sync_point = "http://localhost:3000/sync"
export async function send_sync(username, TOC, server_copy = [], code = 0) {
  let dlatest = diff_latest(TOC, server_copy);
  let send = {
    code: code,
    course_name: COURSE_NAME,
    username: username,
    problem_sets: dlatest
      .filter((val, index) => {
        let serv = server_copy.filter((i) => i.id === val.id);
        let update_server_sync = false;
        if (serv.length > 0) {
          update_server_sync = serv[0].last_updated < val.last_updated;
        } else if(val.last_updated !== 0){
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
