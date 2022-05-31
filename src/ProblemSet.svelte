<script lang="ts">
  import InputProblem from "./InputProblem.svelte";
  import SelectProblem from "./SelectProblem.svelte";
  import { correct_answer_sound, wrong_answer_sound } from "./audio";
  import { createEventDispatcher } from "svelte";
  import { Problem, ProblemSet } from "./ProblemSet";
  import { TOC, TOC_original } from "./data";
  import Prism from "../public/prism";
  import { Sync } from "./utils";
  import SubmissionProblem from "./SubmissionProblem.svelte";

  export let data: ProblemSet;
  const dispatch = createEventDispatcher();
  function check_already_answered_beforehand() {
    if (data.problems.length > 0) {
      return (
        data.problems[data.problem_index].result === "✅" ||
        data.problems[data.problem_index].result === "⚠️"
      );
    } else {
      return false;
    }
  }
  let check_answer;
  let is_valid = false || check_already_answered_beforehand();
  let enable_next_button = false || check_already_answered_beforehand();
  /*  let problem_index =
    progress.indexOf(Result.UNANSWERED) !== -1
      ? progress.indexOf(Result.UNANSWERED)
      : 0; */
  $: finished_all_problems = false;
  $: current_problem = data.problems[data.problem_index];
  $: reset_input_answer = false;
  let reset_problems = false;
  let show_answer_option = false;

  function check() {
    reset_input_answer = false;
    data.problems[data.problem_index].tries += 1;
    if (check_answer && check_answer()) {
      if (check_already_answered_beforehand()) {
        //we already did this problem so just enable the next button and return early

        enable_next_button = true;
        return;
      }
      if (data.problems[data.problem_index].tries == 1) {
        //got it right on the first try
        data.problems[data.problem_index].result = "✅";
      } else {
        //got it wrong once but corrected
        data.problems[data.problem_index].result = "⚠️";
      }
      //the date timestamp for when they got it correct
      data.problems[data.problem_index].time = Date.now();
      enable_next_button = true;
      show_answer_option = false;
      correct_answer_sound.currentTime = 0;
      correct_answer_sound.play();
    } else {
      show_answer_option = true;
      wrong_answer_sound.play();
      data.problems[data.problem_index].result = "❌";
    }
    data.last_updated = Date.now();
    dispatch("save", { code: Sync.UPDATE });
  }
  async function reset() {
    if (data.problem_index < data.problems.length - 1) {
      data.problem_index += 1;
      enable_next_button = false;
      check_answer = null;
      is_valid = false;
    } else {
      finished_all_problems = true;
      if (finished_all_problems) {
        if (reset_problems) {
          reset_problems = false;
          data.problem_index = 0;
          enable_next_button = false;
          check_answer = null;
          is_valid = false;
          finished_all_problems = false;
          if (data.gen) {
            let generated = await data.gen();
            data.problems = generated;
            data.problems = data.problems;
          } else {
            //if the TOC data updates and the user resets the problem, they will get the latest TOC version rather than having an old version of a non-updated TOC
            let cloned = JSON.parse(JSON.stringify(TOC_original)).find(
              (val) => {
                return val.title === data.title;
              }
            ).problems;
            //do not change data.problems = , assignment because it wont work if you do data.problems = .
            //https://svelte.dev/tutorial/updating-arrays-and-objects
            data.problems = cloned;
            data.problems = data.problems;
          }
        } else {
          reset_problems = true;
        }
      }
    }
    data.last_updated = Date.now();
    let code = Sync.UPDATE;
    if (finished_all_problems) {
      code = Sync.ARCHIVE;
    }
    dispatch("save", { code: code });
    reset_input_answer = true;
  }
  /* TODO:
  CONSIDER REMOVING INPUTPROBLEM AND SELECT PROBLEM NEEDING TO COMMUNICATE BACK UP HERE!
  UPDATE-CHECK EVENTS SHOULD BE CONTAINED IN THOSE FILES INSTEAD? Would need to refactor them so they can take an entire array of problems rather than being passed down 1 and having this file control everything*/
</script>

<title>{data.title}</title>
<div>
  {#each data.problems as item, index}
    <span style="margin: 0.5rem;">
      {item.result}
    </span>
  {/each}
  {#if data.problems.length <= 0}
    <h2>Loading...</h2>
  {:else if current_problem.type === "input"}
    <InputProblem
      reset={reset_input_answer}
      data={current_problem}
      {show_answer_option}
      on:update-check={(event) => {
        check_answer = event.detail;
      }}
      on:valid-input={(event) => {
        is_valid = event.detail;
      }}
      on:check-answer={enable_next_button ? reset : check}
    />
  {:else if current_problem.type === "submission"}
    <SubmissionProblem
      title={data.title}
      data={current_problem}
      on:update-check={(event) => {
        check_answer = event.detail;
      }}
      on:valid-input={(event) => {
        is_valid = event.detail;
      }}
      on:check-answer={enable_next_button ? reset : check}
    />
  {:else if current_problem.type === "select"}
    <SelectProblem
      data={current_problem}
      enable_next_button={enable_next_button || reset_problems}
      on:update-check={(event) => {
        check_answer = event.detail;
      }}
      on:valid-input={(event) => {
        is_valid = event.detail;
      }}
    />
  {/if}
  <div class="text-align-center">
    {#if enable_next_button}
      <button class="button" on:click={reset}
        >{finished_all_problems ? "Reset" : "Next"}</button
      >
      <!-- todo: actually submission problems could use a submit button if we want to store said submission in the database but for now i'm just explioting github discussions for these code assignment submissions -->
    {:else if current_problem != undefined && current_problem.type !== "submission"}
      <button
        class={is_valid ? "button" : "button disabled"}
        on:click={check}
        disabled={!is_valid}>Check</button
      >
    {/if}
  </div>
</div>

<style>
  .button {
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    margin: 0px !important;
    position: relative !important;
    display: -webkit-inline-box !important;
    display: -moz-inline-box !important;
    display: -ms-inline-flexbox !important;
    display: -webkit-inline-flex !important;
    display: inline-flex !important;
    -webkit-align-items: center !important;
    align-items: center !important;
    -webkit-justify-content: center !important;
    justify-content: center !important;
    height: 40px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 16px !important;
    padding-right: 16px !important;
    border: none !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    outline: none !important;
    text-decoration: none !important;
    -moz-box-sizing: border-box !important;
    box-sizing: border-box !important;
    -ms-touch-action: manipulation !important;
    touch-action: manipulation !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
    background: #1865f2 !important;
    color: #ffffff !important;
    min-width: 140px !important;
    font-weight: bold;
  }
  .disabled {
    background: rgba(33, 36, 44, 0.32) !important;
  }

  .text-align-center {
    text-align: center;
  }

  :global(.current) {
    border: 3px solid purple;
  }
  :global(.correct) {
    background-color: lightgreen;
  }
  :global(.wrong) {
    background-color: salmon;
  }
</style>
