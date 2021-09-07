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
    let is_correct =
      data.answer == input_answer ||
      data.answer.toString().toLowerCase() == input_answer.toLowerCase();
    return is_correct;
  });
  $: dispatch("valid-input", input_answer.length > 0);
  afterUpdate(() => {
    Prism.highlightAll();
  });
</script>

<div>
  <div>
    {@html data.question}
  </div>
  <p>{data.input_answer_hint}</p>
  <input type="text" bind:value={input_answer} />
  {#if show_answer_option}
    <details>
      <summary>show answer</summary>
      {data.answer}
    </details>
  {/if}
</div>
