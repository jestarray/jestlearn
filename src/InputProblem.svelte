<script type="ts">
  export let data;
  export let reset;
  import { createEventDispatcher, afterUpdate } from "svelte";
  const dispatch = createEventDispatcher();
  export let input_answer = "";
  export let show_answer_option;
  $: if (reset) {
    input_answer = "";
  }
  $: dispatch("update-check", function check_answer() {
    // using coersion here. might have to handle cases where evaluation of the expression needs to be done before checking answer
    // or force everyone to genereate the json evaluted??
    //console.log(data.answer);
    //answer can optionally be space insensitive

    let is_correct =
      data.answer == input_answer ||
      data.answer.toString().toLowerCase() == input_answer.toLowerCase() ||
      data.answer.toString().replace(/\s/g, "") ===
        input_answer.replace(/\s/g, "");
    return is_correct;
  });
  $: dispatch("valid-input", input_answer.length > 0);
  afterUpdate(() => {
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
    on:keypress={(e) => {
      if (input_answer.length > 0 && e.key === "Enter") {
        dispatch("check-answer");
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
