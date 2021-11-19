<script type="ts">
  export let title;
  export let data;
  import { createEventDispatcher, afterUpdate } from "svelte";
  import Discussions from "./Discussions.svelte";
  const dispatch = createEventDispatcher();

  /*   $: if (reset) {
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
   */
</script>

<div>
  <div>
    {@html data.question}
  </div>
  <Discussions {title} submission={true} />
</div>

<style>
</style>
