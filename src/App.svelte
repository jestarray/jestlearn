<script lang="ts">
  import ProblemSet from "./ProblemSet.svelte";
  import type { ProblemSet as ProblemSetData } from "./ProblemSet";
  import Home from "./routes/Home.svelte";
  import { Sync } from "./utils";
  import router from "page";
  import { convert_to_hash, diff_latest, send_sync } from "./utils";
  import { TOC, TOC_original } from "./data";
  import Discussions from "./Discussions.svelte";

  // converts hash url to title, e.g binary_to_decimal -> Binary To Decimal
  export function convert_to_title(st: string): string {
    let words = st.split("_");
    let upper_cased = words.map((item) => {
      return item.charAt(0).toLocaleUpperCase() + item.slice(1);
    });
    let result = upper_cased.reduceRight((item, acc) => {
      return acc + " " + item;
    });
    return result;
  }
  let page;
  let params;
  let section: ProblemSetData | undefined;
  let merged = TOC;

  router("/", (ctx, next) => {
    let hash: string = ctx.hash;
    if (hash.includes("discuss")) {
      page = Discussions;
      let slash_index = hash.indexOf("/") + 1;
      let path = hash.slice(slash_index, hash.length);
      console.log(path);
      let title = convert_to_title(path);
      params = { title: title };
    } else {
      //user is on a problem page or the home page
      let saved: ProblemSet[] | null = JSON.parse(localStorage.getItem("save"));

      if (saved) {
        //use the save to overwrite the orignal problems
        //maybe it should only overwrite the ones that need overriding rather than the entire thing
        merged = TOC.map((curr, index) => {
          let tmp = curr.num_of_problems;
          //shallow copy, hence we assign to tmp
          let res = Object.assign(curr, saved[index]);
          // it should not override numb of problems generation prop since that shoud always be from the TOC
          res.num_of_problems = tmp;
          return res;
        });
      }

      section = merged.find((item) => {
        return convert_to_hash(item.title) === hash;
      });
      if (section !== undefined) {
        page = ProblemSet;
        params = section;
        if (params.problems.length > 0) {
          // restore from save file
          params.problems = params.problems;
        } else if (section.gen !== undefined) {
          //if the problem set is randomly generated, generate some problems
          params.problems = Array.from(new Array(section.num_of_problems), () =>
            params.gen()
          );
        } else {
          params.problems = params.problems;
        }
      } else {
        page = Home;
      }
    }
  });
  router("/discuss", () => {
    page = Discussions;
  });

  router.start();
</script>

{#if page !== Home}
  <nav class="home-alignment">
    <a href="/">🏠Home</a>
  </nav>
{/if}

<main class="flex-placement">
  <svelte:component
    this={page}
    {params}
    title={params ? params.title : ""}
    data={params}
    on:save={(diff_with) => {
      let server_data = diff_with.detail;
      if (server_data !== null && server_data.problems !== undefined) {
        localStorage.setItem("save_server", JSON.stringify(server_data));
      }
      let server_save_cache = JSON.parse(localStorage.getItem("save_server"));
      if (server_save_cache !== null) {
        merged = diff_latest(merged, server_save_cache.problems);
        if (server_data.code == Sync.ARCHIVE) {
          console.log("archiving");
        }
        //not elseif!
        if (server_data.code !== Sync.INITIAL) {
          send_sync(
            server_save_cache.username,
            merged,
            server_save_cache.problems,
            server_data.code
          ).then((rr) => {});
        }
      }
      //merge back the toc tags and stuff
      merged = diff_latest(merged, TOC_original);
      console.log(merged, TOC_original, merged);
      localStorage.setItem("save", JSON.stringify(merged));
      //todo: diff with server copy and then upload to server
      //server should only store old finished attempts for analytics, e.g when the reset button is hit, so need to distuginish
      console.log("LOG: SAVING");
      //let saved = localStorage.getItem("save");
    }}
  />
</main>

<style>
  .flex-placement {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .home-alignment {
    text-align: center;
  }

  @media (max-width: 480px) {
    main {
      max-width: none;
    }
    .flex-placement {
      display: unset;
    }
    .home-alignment {
      text-align: end;
    }
  }
</style>
