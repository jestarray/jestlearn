<script>
  export let title;
</script>

<div>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <h1>{title + " Discussion"}</h1>
  <h2>For assignment positions, please wrap your code within this block</h2>
  <h3 style="color: red;">DO NOT EDIT YOUR SOLUTION BASED ON OTHERS</h3>
  <pre>
&lt;details&gt;

<code>
```scheme

(define PASTE-CODE-HERE #true)

```
</code>
&lt;/details&gt;
</pre>

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
    crossorigin="anonymous"
    async>
  </script>
  <div class="giscus">
    <div class="giscus-frame" />
  </div>
</div>
