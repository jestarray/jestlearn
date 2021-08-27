<script>
  export let title;
</script>

<title>{title}</title>
<div class="utterances">
  <h1>{title + ' Discussion'}</h1>
  <p>Ask questions, suggest improvements, etc</p>
  <script
    src="https://utteranc.es/client.js"
    repo="jestarray/jest_systems_web"
    issue-term="title"
    theme="github-light"
    crossorigin="anonymous"
    async>
  </script>
  <div class="utterance-frame" />
</div>
