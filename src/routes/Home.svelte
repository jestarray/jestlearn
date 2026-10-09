<script lang="ts">
  import type { Problem, ProblemSet as ProblemSetData } from "../ProblemSet";
  import { convert_to_hash } from "../utils";
  import { TOC, COURSE_NAME } from "../data";
  import { Sync, send_sync } from "../utils";

  let {
    base_path,
    merged,
    server_save_cache,
    onSave,
  }: {
    base_path: string;
    merged: ProblemSetData[];
    server_save_cache: any;
    onSave?: (data_from_server: any) => void;
  } = $props();

  let search_text = $state("");
  let username = $state("");

  // a returning user already has a username cached on this device
  $effect(() => {
    if (server_save_cache) {
      username = server_save_cache.username;
    }
  });

  let filtered = $derived(
    search_text.length > 0
      ? merged.filter((item) => {
          let lowercase_search = search_text.toLowerCase();
          function find_one(arr: string[], search: string): boolean {
            for (let item of arr) {
              if (item.includes(search)) {
                return true;
              }
            }
            return false;
          }
          return (
            item.title.toLowerCase().includes(lowercase_search) ||
            find_one(item.tags, lowercase_search.trim())
          );
        })
      : merged,
  );

  function calculate_progress(progress: Problem[]) {
    let solved = 0;
    for (let item of progress) {
      if (item.result === "✅") {
        solved++;
      }
    }
    let res = `${solved}/${progress.length}`;
    return res;
  }

  function close_resources_modal() {
    var modal = document.getElementById("resources-modal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  window.onclick = function (event) {
    var modal = document.getElementById("resources-modal");
    if (event.target == modal && modal) {
      modal.style.display = "none";
    }
  };

  function delete_data() {
    localStorage.removeItem("save_server");
    localStorage.removeItem("save");
  }
</script>

<div>
  <h1>{COURSE_NAME}</h1>
  <div class="main-bar">
    <input type="text" placeholder="Search" bind:value={search_text} />
    {#if server_save_cache}
      <i>Joined: {new Date(server_save_cache.date_created).toDateString()}</i>,
      Logged in as: <b>{server_save_cache.username}</b>
      <button
        class="logout-button"
        onclick={() => {
          delete_data();
          location.reload();
        }}>Logout</button
      >
    {:else}
      <input
        name="username"
        type="text"
        placeholder="Username"
        bind:value={username}
      /><button
        onclick={function login() {
          //validate username form
          if (username.length > 0) {
            //send the problems worked on to the server
            send_sync(username.toLowerCase().trim(), TOC, [], Sync.INITIAL)
              .then((data_from_server) => {
                data_from_server.code = Sync.INITIAL;
                onSave?.(data_from_server);
                //force page refresh after save to update the homepage
                //location.reload();
              })
              .catch((err) => {
                console.warn(err);
              });
          }
        }}>Enter</button
      >
    {/if}
  </div>

  <div id="resources-modal" class="modal">
    <div class="modal-content" id="m-content">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span class="close" onclick={close_resources_modal}>&times;</span>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Section</th>
        <th scope="col">Title</th>
        <th scope="col">Progress</th>
        <th scope="col">Resources</th>
        <th scope="col">Discuss</th>
        <th scope="col">Mark</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as item}
        <tr>
          <td>{item.id}</td>
          <td>{item.section}</td>
          <td><a href={"#" + convert_to_hash(item.title)}>{item.title}</a></td>
          <td>{calculate_progress(item.problems)} </td>
          <td>
            {#if item.resources}
              <button
                disabled={item.resources.length <= 0}
                onclick={() => {
                  var modal = document.getElementById("resources-modal");
                  var modal_content = document.getElementById("m-content");
                  if (!modal || !modal_content) {
                    return;
                  }
                  modal.style.display = "block";
                  if (item.resources.length > 0) {
                    modal_content.innerHTML = item.resources
                      .map((res) => {
                        return `<p>
                  <a href=${res.url} title=${res.url} target="_blank"
                    >${res.url_title}
                  </a>
                  ${res.additional}
                </p>`;
                      })
                      .reduce((prev, curr) => prev + curr);
                  } else {
                    modal_content.innerHTML = "";
                  }
                }}>View</button
              >
            {/if}
          </td>
          <td
            ><a href={`${base_path}#discuss/${convert_to_hash(item.title)}`}
              >Github</a
            ></td
          >
          <td
            ><select
              bind:value={item.emoji_mark}
              onchange={() => {
                item.last_updated = Date.now();
                onSave?.({ code: Sync.UPDATE });
              }}
            >
              <option value="❓">❓</option>
              <option value="⚠️">⚠️</option>
              <option value="✅">✅</option>
              <option value="❌">❌</option>
            </select></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
  <a href="https://github.com/jestarray/jestlearn">v0.6.1</a>
  |
  <a href="https://www.youtube.com/c/jestarray">Youtube</a>
  |
  <a href="https://www.patreon.com/jestarray/">Support my work on Patreon!</a>
  | <a href="https://forms.gle/ehWtqgfmnv5N7c3e8">Survey</a>
  | <a href="https://www.jestlearn.com/">Other courses</a>
  |
  <a
    href="#/"
    onclick={() => {
      //todo: should send a req to the server deleting user data also?
      //mainly for malformed sync data
      delete_data();
      location.reload();
    }}>Reset All</a
  >
</div>

<style>
  /* The Modal (background) */
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }
  .main-bar {
    display: inline;
  }

  /* Modal Content */
  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  /* The Close Button */
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .logout-button {
    background-color: salmon;
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
</style>
