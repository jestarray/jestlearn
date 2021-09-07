<script lang="ts">
  import ProblemSet from "./ProblemSet.svelte";
  import { merge_gen_funcs, ProblemSet as ProblemSetData } from "./ProblemSet";
  import Home from "./routes/Home.svelte";
  import { Sync } from "./utils";
  import router from "page";
  import { convert_to_hash, diff_latest, send_sync } from "./utils";
  import { TOC, TOC_original, COURSE_NAME } from "./data";
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
  let discussion_title = "";
  let section: ProblemSetData | undefined;
  let merged = TOC;

  async function route_pages(ctx, next) {
    let hash: string = ctx.hash;
    if (hash.includes("discuss")) {
      page = Discussions;
      let slash_index = hash.indexOf("/") + 1;
      let path = hash.slice(slash_index, hash.length);
      let title = convert_to_title(path);
      discussion_title = title;
    } else {
      //user is on a problem page or the home page
      // the gen() function was probably not serialized
      let saved: ProblemSetData[] | null = JSON.parse(
        localStorage.getItem("save")
      );
      if (saved) {
        merged = merge_gen_funcs(diff_latest(TOC, saved), TOC);
      }
      section = merged.find((item) => {
        return convert_to_hash(item.title) === hash;
      });
      if (section !== undefined) {
        page = ProblemSet;
        if (section.problems.length > 0) {
          // restore from save file
          section.problems = section.problems;
        } else if (section.gen !== undefined) {
          //if the problem set is randomly generated, generate some problems
          let generated = await section.gen();
          section.problems = generated;
          //re-assign for svelte reactivity or else the UI wont update
          section.problems = section.problems;
        } else {
          console.warn("should not have gotten here! ");
          section.problems = section.problems;
        }
      } else {
        page = Home;
      }
    }
  }
  //for when you have a single domain but multiple courses on that domain/server where the vps distributes all the course static files(see server.js), e.g jestlearn.com/computers404 , jestlearn.com/how_to_code , we will attempt to use this instead for the base path. The route below "/" will never run if this is the case
  let course_base_path = `/${convert_to_hash(COURSE_NAME)}/`;

  router(`${course_base_path}`, (ctx, next) => {
    route_pages(ctx, next);
  });
  //if your course is on  a single domain e.g learnhowtocode.com/ hosted on github pages or something, then we will set the base path to /

  router(`/`, (ctx, next) => {
    route_pages(ctx, next);
    course_base_path = "/";
  });
  router("/discuss", () => {
    page = Discussions;
  });

  router.start();

  function filter_non_worked_on(arr: ProblemSetData[]) {
    return arr.filter((val) => val.last_updated > 0);
  }
</script>

{#if page !== Home}
  <nav class="home-alignment">
    <a href={`${course_base_path}`}>🏠Home</a>
  </nav>
{/if}

<main class="flex-placement">
  <svelte:component
    this={page}
    base_path={course_base_path}
    title={discussion_title}
    data={section}
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
          )
            .then((rr) => {})
            .catch((err) => {
              console.warn(err);
            });
        }
      }
      //merge back the toc tags and stuff
      merged = diff_latest(merged, TOC_original);
      //todo: dont save the ones that are last_upadted 0?
      localStorage.setItem(
        "save",
        JSON.stringify(filter_non_worked_on(merged))
      );
      //todo: diff with server copy and then upload to server
      //server should only store old finished attempts for analytics, e.g when the reset button is hit, so need to distuginish
      console.log("LOG: SAVING");
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
