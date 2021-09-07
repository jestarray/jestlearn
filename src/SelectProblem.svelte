<script type="ts">
  export let data;
  export let enable_next_button;
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();
  $: selected = [];
  $: dispatch("update-check", function check_answer() {
    let correct_indexes: number[] = data.answer
      .map((item, index) => {
        if (item.correct) {
          return index;
        }
      })
      .filter((item) => {
        if (item !== undefined) {
          return true;
        }
      });
    //did not pick all the answers, therefore got it wrong
    if (correct_indexes.length !== selected.length) {
      return false;
    } else {
      //if even got one of the selections wrong, you got the whole thing wrong
      for (let item of correct_indexes) {
        if (selected.includes(item) == false) {
          return false;
        }
      }
      //otherwise you got it right
      //maybe we should not reset it here? since users want to see their selected answers for a bit until clicking the next buttotn
      selected = [];
      return true;
    }
  });
  //refresh syntax highlighting!
  // TODO: warning! it refreshes on every update! maybe we should just use prism to static pre- generate/rendering and shove that into the problem html and not have to worry about dynamic syntax highlighting. Probably not a big deal though if highlightAll() is nothing perf wise
  // https://prismjs.com/#basic-usage-node
  afterUpdate(() => {
    Prism.highlightAll();
  });
  $: dispatch("valid-input", selected.length > 0);
  function color_answers(is_correct) {
    if (enable_next_button) {
      if (is_correct) {
        return "correct";
      } else {
        return "wrong";
      }
    } else {
      return "";
    }
  }
</script>

<div>
  <div>
    {@html data.question}
  </div>
  {#each data.answer as option, index}
    <label class={color_answers(option.correct)}>
      <!-- selected_radio_index = index -->
      <input
        type="checkbox"
        bind:group={selected}
        value={index}
        on:click={function () {}}
        disabled={enable_next_button}
      />
      {@html option.text}
      {#if enable_next_button}
        <br />
        {@html option.explanation}
      {/if}
    </label>
  {/each}
</div>

<style>
  label {
    border: 2px solid grey;
    border-radius: 25px;
    padding: 1em;
    margin: 4px;
  }
  label:hover {
    border: 2px solid blue;
  }
</style>
