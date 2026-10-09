<script lang="ts">
  import type { AnswerOption, Problem } from "./ProblemSet";

  let {
    data,
    enable_next_button = false,
    onUpdateCheck,
    onValidInput,
  }: {
    data: Problem;
    enable_next_button?: boolean;
    onUpdateCheck?: (check_answer: () => boolean) => void;
    onValidInput?: (is_valid: boolean) => void;
  } = $props();

  let selected = $state<number[]>([]);
  const answers = $derived(
    (Array.isArray(data.answer) ? data.answer : []) as AnswerOption[],
  );

  function check_answer() {
    let correct_indexes: number[] = answers
      .map((item, index) => {
        if (item.correct) {
          return index;
        }
        return -1;
      })
      .filter((index) => {
        return index !== -1;
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
  }

  // hand the checker and the validity of the current selection up to ProblemSet
  $effect(() => {
    onUpdateCheck?.(check_answer);
    onValidInput?.(selected.length > 0);
  });

  //refresh syntax highlighting!
  // TODO: warning! it refreshes on every update! maybe we should just use prism to static pre- generate/rendering and shove that into the problem html and not have to worry about dynamic syntax highlighting. Probably not a big deal though if highlightAll() is nothing perf wise
  // https://prismjs.com/#basic-usage-node
  $effect(() => {
    void data;
    void enable_next_button;
    void selected.length;
    Prism.highlightAll();
  });

  function color_answers(is_correct: boolean) {
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
  {#each answers as option, index}
    <label class={color_answers(option.correct)}>
      <input
        type="checkbox"
        bind:group={selected}
        value={index}
        disabled={enable_next_button}
      />
      {@html option.text}
      {#if enable_next_button}
        <br />
        {@html option.explanation ?? ""}
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
