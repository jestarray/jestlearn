<script lang="ts">
  import type { Problem } from "./ProblemSet";
  import Discussions from "./Discussions.svelte";

  let { title, data }: { title: string; data: Problem } = $props();

  //refresh syntax highlighting!
  $effect(() => {
    void data;
    Prism.highlightAll();
  });
</script>

<div>
  <div>
    {@html data.question}
  </div>
  <Discussions {title} submission={true} />
</div>
