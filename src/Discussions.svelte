<script lang="ts">
  import { Giscus } from "@giscus/svelte";
  export let title;

  import { createEventDispatcher, afterUpdate } from "svelte";
  // todo: use server side rendering for highlighting the below codeblock?
  afterUpdate(() => {
    Prism.highlightAll();
  });
</script>

<meta property="og:title" content={title} />
<div>
  <title>{title}</title>
  <h1>{title + " Discussion"}</h1>
  <h2>For assignment positions, please wrap your code within this block</h2>
  <h3 style="color: red;">DO NOT EDIT YOUR SOLUTION BASED ON OTHERS</h3>
  <pre>
&lt;details&gt;

<code class="language-html">
```scheme

(define PASTE-CODE-HERE #true)

```
</code>
&lt;/details&gt;
</pre>
  <!--  <div class="giscus">
    <div class="giscus-frame" />
  </div> -->
  <script
    src="https://giscus.app/client.js"
    data-repo="jestarray/howtocode"
    data-repo-id="MDEwOlJlcG9zaXRvcnk0MDM3MTI1NTA="
    data-category="Assignment Submissions"
    data-category-id="DIC_kwDOGBAqJs4B_l8z"
    data-mapping="og:title"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-theme="light"
    data-lang="en"
    crossorigin="anonymous">
  </script>
  <!-- <Giscus
    repo="jestarray/howtocode"
    repoId="MDEwOlJlcG9zaXRvcnk0MDM3MTI1NTA"
    category="Assignment Submissions"
    categoryId="DIC_kwDOGBAqJs4B_l8z"
    mapping="og:title"
    reactionsEnabled="1"
    emitMetadata="0"
    theme="light"
  /> -->
</div>
