<script lang="ts">
  // @giscus/svelte v3 exports the component as the default export
  import Giscus from "@giscus/svelte";

  let { title, submission = false }: { title: string; submission?: boolean } =
    $props();
  const catagories = $derived(
    submission
      ? { name: "Assignment Submissions", id: "DIC_kwDOGBAqJs4B_l8z" }
      : { name: "Help", id: "DIC_kwDOGBAqJs4B_o5o" },
  );

  // todo: use server side rendering for highlighting the below codeblock?
  $effect(() => {
    void title;
    Prism.highlightAll();
  });
</script>

<meta property="og:title" content={title} />
<div>
  <title>{title}</title>
  <h1>{title + " Discussion"}</h1>
  <h2 style="color: red;">
    Please wrap code in the following block as to avoid spoilers for others
  </h2>

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
    What I cannot create, I do not understand - Feynman
  </h3>
  <h3 style="color: red;">
    I hear and I forget. I see and I remember. I do and I understand. -
    Confucius
  </h3>
  <!-- <div class="giscus">
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
    data-theme="https://jestlearn.com/how_to_code/giscus.css"
    data-lang="en"
    crossorigin="anonymous">
  </script>
  <!-- <Giscus
    repo="jestarray/howtocode"
    repoId="MDEwOlJlcG9zaXRvcnk0MDM3MTI1NTA="
    category={catagories.name}
    categoryId={catagories.id}
    mapping="og:title"
    reactionsEnabled="1"
    emitMetadata="0"
    theme="light"
  /> -->
</div>
