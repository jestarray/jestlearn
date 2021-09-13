<script lang="ts">
  import type { ProblemSet as ProblemSetData } from "../ProblemSet";
  import { convert_to_hash } from "../utils";
  import { TOC, COURSE_NAME } from "../data";
  import { createEventDispatcher } from "svelte";
  import { has_started } from "../ProblemSet";
  import { Sync, send_sync } from "../utils";
  export let base_path;
  export let merged: ProblemSetData[];
  export let server_save_cache;
  const dispatch = createEventDispatcher();
  $: search_text = "";
  $: filtered =
    search_text.length > 0
      ? merged.filter((item) => {
          let lowercase_search = search_text.toLowerCase();
          function find_one(arr, search): boolean {
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
      : merged;
  function calculate_progress(progress) {
    let solved = 0;
    for (let item of progress) {
      if (item.result === "✅") {
        solved++;
      }
    }
    let res = `${solved}/${progress.length}`;
    return res;
  }
  window.onclick = function (event) {
    var modal = document.getElementById("resources-modal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  let username = "";
  if (server_save_cache) {
    username = server_save_cache.username;
  }
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
        on:click={() => {
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
        on:click={function login() {
          //validate username form
          if (username.length > 0) {
            //send the problems worked on to the server
            send_sync(username.toLowerCase().trim(), TOC, [], Sync.INITIAL)
              .then((data_from_server) => {
                data_from_server.code = Sync.INITIAL;
                dispatch("save", data_from_server);
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
      <span
        class="close"
        on:click={() => {
          var modal = document.getElementById("resources-modal");
          modal.style.display = "none";
        }}>&times;</span
      >
    </div>
  </div>
  <table>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Title</th>
      <th scope="col">Progress</th>
      <th scope="col">Resources</th>
      <th scope="col">Discuss</th>
      <th scope="col">Mark</th>
    </tr>

    {#each filtered as item}
      <tr>
        <td>{item.id}</td>
        <td><a href={"#" + convert_to_hash(item.title)}>{item.title}</a></td>
        <td>{calculate_progress(item.problems)} </td>
        <td>
          {#if item.resources}
            <button
              disabled={item.resources.length <= 0}
              on:click={() => {
                var modal = document.getElementById("resources-modal");
                modal.style.display = "block";
                var modal_content = document.getElementById("m-content");
                if (item.resources.length > 0) {
                  modal_content.innerHTML = item.resources
                    .map((res) => {
                      return `<p>
                  <a href=${res.url} title=${res.url} target="_blank"
                    >${res.url}
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
            on:change={() => {
              item.last_updated = Date.now();
              dispatch("save", { code: Sync.UPDATE });
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
  </table>
  <a href="https://github.com/jestarray/jestlearn">v0.0.5</a>
  |
  <a href="https://www.patreon.com/jestarray/">Support my work on Patreon!</a>
  | <a href="https://www.jestlearn.com/">Other courses</a>
  |
  <a
    href="#/"
    on:click={() => {
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
