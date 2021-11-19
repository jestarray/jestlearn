<script lang="ts">
  import { Giscus } from "@giscus/svelte";
  export let title;
  export let submission; //bool to switch submissions to the help thread instead
  let catagories = { name: "Help", id: "DIC_kwDOGBAqJs4B_o5o" };
  if (submission) {
    catagories = { name: "Assignment Submissions", id: "DIC_kwDOGBAqJs4B_l8z" };
  }

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
  <h3 style="color: red;">
    CHEATING WILL ONLY BITE YOU BACK IN THE END AS THINGS GET MORE DIFFICULT
  </h3>
  <!--  <div class="giscus">
    <div class="giscus-frame" />
  </div> -->
  <script
    src="https://giscus.app/client.js"
    data-repo="jestarray/howtocode"
    data-repo-id="MDEwOlJlcG9zaXRvcnk0MDM3MTI1NTA="
    data-category={catagories.name}
    data-category-id={catagories.id}
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
