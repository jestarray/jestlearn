<script lang="ts">
  import type { Problem } from "./ProblemSet";

  let {
    data,
    reset_input = 0,
    show_answer_option = false,
    onUpdateCheck,
    onValidInput,
    onCheckAnswer,
  }: {
    data: Problem;
    reset_input?: number;
    show_answer_option?: boolean;
    onUpdateCheck?: (check_answer: () => boolean) => void;
    onValidInput?: (is_valid: boolean) => void;
    onCheckAnswer?: () => void;
  } = $props();

  let input_answer = $state("");

  function check_answer() {
    // using coersion here. might have to handle cases where evaluation of the expression needs to be done before checking answer
    // or force everyone to genereate the json evaluted??
    //answer can optionally be space insensitive

    let is_correct =
      data.answer == input_answer ||
      data.answer.toString().toLowerCase() == input_answer.toLowerCase() ||
      data.answer.toString().replace(/\s/g, "") ===
        input_answer.replace(/\s/g, "");
    return is_correct;
  }

  // hand the checker and the validity of the current input up to ProblemSet
  $effect(() => {
    onUpdateCheck?.(check_answer);
    onValidInput?.(input_answer.length > 0);
  });

  // ProblemSet bumps reset_input when we moved on to another problem
  $effect(() => {
    void reset_input;
    input_answer = "";
  });

  //refresh syntax highlighting!
  $effect(() => {
    void data;
    void show_answer_option;
    Prism.highlightAll();
  });
  //todo: hotkey enter to submit the answer
</script>

<div>
  <div>
    {@html data.question}
  </div>
  <p>
    {@html data.input_answer_hint}
  </p>
  <input
    type="text"
    bind:value={input_answer}
    onkeypress={(e) => {
      if (input_answer.length > 0 && e.key === "Enter") {
        onCheckAnswer?.();
      }
    }}
  />
  {#if show_answer_option}
    <details>
      <summary><span class="red">show answer</span></summary>
      {data.answer}
    </details>
  {/if}
</div>

<style>
  .red {
    color: red;
  }
</style>
