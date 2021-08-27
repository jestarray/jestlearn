<script>
  export let data;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let selected_radio_index;
  let is_valid_input = false;

  $: dispatch("update-check", function check_answer() {
    let selected = data.answer[selected_radio_index];
    let is_correct = selected.correct;
    return is_correct;
  });
</script>

<div>
  <div>
    {@html data.question}
  </div>

  {#each data.answer as option, index}
    <label>
      <!-- selected_radio_index = index -->
      <input
        type="radio"
        bind:group={selected_radio_index}
        value={index}
        on:click={function () {
          is_valid_input = true;
          dispatch("valid-input", is_valid_input);
        }}
      />
      {option.text}
    </label>
  {/each}
</div>

<style>
  label {
    border: 1px solid grey;
    border-radius: 25px;
    margin: 2px;
  }
</style>
