<script lang="ts">
  import InputProblem from "./InputProblem.svelte";
  import SelectProblem from "./SelectProblem.svelte";
  import SubmissionProblem from "./SubmissionProblem.svelte";
  import { correct_answer_sound, wrong_answer_sound } from "./audio";
  import type { ProblemSet as ProblemSetData } from "./ProblemSet";
  import { TOC_original } from "./data";
  import { Sync } from "./utils";

  let {
    data,
    onSave,
  }: {
    data: ProblemSetData;
    onSave?: (event: { code: Sync }) => void;
  } = $props();

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

  let check_answer = $state<(() => boolean) | null>(null);
  let is_valid = $state(check_already_answered_beforehand());
  let enable_next_button = $state(check_already_answered_beforehand());
  let finished_all_problems = $state(false);
  let current_problem = $derived(data.problems[data.problem_index]);
  // bumped whenever the answer input should be emptied (i.e. on every next/reset)
  let reset_input = $state(0);
  let reset_problems = $state(false);
  let show_answer_option = $state(false);

  // the child problems hand their checker + input validity up to us
  function set_check_answer(fn: () => boolean) {
    check_answer = fn;
  }
  function set_valid(valid: boolean) {
    is_valid = valid;
  }

  function check() {
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
    onSave?.({ code: Sync.UPDATE });
  }

  async function reset() {
    if (data.problem_index < data.problems.length - 1) {
      data.problem_index += 1;
      enable_next_button = false;
      check_answer = null;
      is_valid = false;
    } else {
      finished_all_problems = true;
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
        } else {
          //if the TOC data updates and the user resets the problem, they will get the latest TOC version rather than having an old version of a non-updated TOC
          let cloned = JSON.parse(JSON.stringify(TOC_original)).find(
            (val: ProblemSetData) => {
              return val.title === data.title;
            },
          ).problems;
          data.problems = cloned;
        }
      } else {
        reset_problems = true;
      }
    }
    data.last_updated = Date.now();
    let code = Sync.UPDATE;
    if (finished_all_problems) {
      code = Sync.ARCHIVE;
    }
    onSave?.({ code: code });
    //the answer box of the problem we just moved onto has to be emptied
    reset_input += 1;
  }
  /* TODO:
  CONSIDER REMOVING INPUTPROBLEM AND SELECT PROBLEM NEEDING TO COMMUNICATE BACK UP HERE!
  UPDATE-CHECK EVENTS SHOULD BE CONTAINED IN THOSE FILES INSTEAD? Would need to refactor them so they can take an entire array of problems rather than being passed down 1 and having this file control everything*/
</script>

<title>{data.title}</title>
<div>
  {#each data.problems as item}
    <span style="margin: 0.5rem;">
      {item.result}
    </span>
  {/each}
  {#if data.problems.length <= 0}
    <h2>Loading...</h2>
  {:else if current_problem.type === "input"}
    <InputProblem
      data={current_problem}
      {reset_input}
      {show_answer_option}
      onUpdateCheck={set_check_answer}
      onValidInput={set_valid}
      onCheckAnswer={enable_next_button ? reset : check}
    />
  {:else if current_problem.type === "submission"}
    <SubmissionProblem title={data.title} data={current_problem} />
  {:else if current_problem.type === "select"}
    <SelectProblem
      data={current_problem}
      enable_next_button={enable_next_button || reset_problems}
      onUpdateCheck={set_check_answer}
      onValidInput={set_valid}
    />
  {/if}
  <div class="text-align-center">
    {#if enable_next_button}
      <button class="button" onclick={reset}
        >{finished_all_problems ? "Reset" : "Next"}</button
      >
      <!-- todo: actually submission problems could use a submit button if we want to store said submission in the database but for now i'm just explioting github discussions for these code assignment submissions -->
    {:else if current_problem != undefined && current_problem.type !== "submission"}
      <button
        class={is_valid ? "button" : "button disabled"}
        onclick={check}
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
