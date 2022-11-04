import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
// import parse from "html-react-parser";
import { HTMLReactParserOptions, Element, domToReact } from "html-react-parser";
import { useState, useEffect } from "react";
// import Document from "../_document";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import {
  VerseMarker,
  ChapterMarker,
  Verse,
  Spacer,
  Footnotes,
} from "../../components/molecules";
// import api from "../api/api";
import { useRouter } from "next/router";
import localPaths from "../../paths";

interface Props {
  data: {
    justScripture2: Array<string>;
    staticMarkup: string;
    regenerationTimestamp: string;
    buildId: string;
  };
}

export default function Page({ data, ...restProps }: Props) {
  // debugger;

  let staticMarkup = data ? data.staticMarkup : null;
  let regenerationTimestamp = data ? data.regenerationTimestamp : null;
  const router = useRouter();
  console.log({ router });

  let byChapters: Element[] = [];
  let changed = true;
  console.log(changed);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hasBeenCached, setHasBeenCached] = useState(false);
  // const sections = data.map(chapter => {
  // 	return parse(chapter, {

  // 	})
  // })
  // useEffect(() => {
  // console.log(
  //   "I think I am an immutable asset.  I think I will be cached, and by a service worker.  I now need to see if this hash is changing to feel comfy.  And here is yet another change.  A diff build id. Still cached? "
  // );
  // if (!staticMarkup || !regenerationTimestamp) {
  //   router.push("/_offline");
  //   return;
  // }

  /* Check all perhaps alter */
  /* https://stackoverflow.com/questions/53360988/service-worker-list-all-urls-in-cache-and-pass-to-another-function */
  //   async function checkCustomCache() {
  //     let corresponding = await caches.open("others-test1");
  //     if (corresponding) {
  //       let hasMatch = await corresponding.match(window.location.pathname);
  //       setHasBeenCached(hasMatch ? true : false);
  //       if (hasMatch) {
  //         console.log(
  //           "checking cache to see if json is also cached in addition to html"
  //         );
  //         router.prefetch(window.location.href);
  //       }
  //     }
  //     return false;
  //   }
  //   checkCustomCache();
  // }, []);

  // const options: HTMLReactParserOptions = {
  //   replace: (domNode) => {
  //     if (domNode instanceof Element && domNode.attribs) {
  //       // ...
  //       if (domNode.attribs.class === "versemarker") {
  //         return (
  //           <VerseMarker>{domToReact(domNode.children, options)}</VerseMarker>
  //         );
  //       }
  //       if (domNode.attribs.class === "chaptermarker") {
  //         return (
  //           <ChapterMarker>
  //             {domToReact(domNode.children, options)}
  //           </ChapterMarker>
  //         );
  //       }
  //       if (domNode.name === "p" && domNode.children?.length === 1) {
  //         return <br />;
  //       }
  //     }
  //   },
  // };

  // function renderChapter(index: number) {
  // 	return parse(byChapters[index])
  // }
  // const router = useRouter();
  // const morePosts = posts?.edges;

  // if (!router.isFallback && !post?.slug) {
  //   return <ErrorPage statusCode={404} />;
  // }
  // enum navigateDirections {
  //   prev = "prev",
  //   next = "next",
  // }
  function navigate(dir: string) {
    console.log(currentIdx);
    if (dir === "prev") {
      return setCurrentIdx((prev) => --prev);
    } else if (dir === "next") {
      return setCurrentIdx((prev) => ++prev);
    }
  }

  if (!staticMarkup || !regenerationTimestamp) {
    return null;
  }
  function createMarkup(mk: string) {
    return { __html: mk };
  }

  return (
    <>
      <div className="py-4 px-4 font-sans">
        <span>
          Hi there: This page was last created at {regenerationTimestamp}
        </span>
        {/* <p>{hasBeenCached ? "I am cached!" : "I am not cached : ("}</p> */}
        <header>
          <Link href="/u">
            <a className="  block text-blue-600">Go to listing page</a>
          </Link>
          <button
            onClick={async (e) => {
              // debugger
              let url = `${window.location.href}?download=true`;
              let response = await fetch(url);
              let data = await response.text();
              console.log({ response });
            }}
          >
            Hey service Worker! Plz cache me for offline use!
          </button>
        </header>
        <div className=" flex   max-h-screen overflow-y-scroll">
          <div className=" relativeflex-grow  flex">
            <button
              disabled={currentIdx === 0}
              className="sticky top-0 ml-auto block h-screen w-24 bg-color-gray disabled:cursor-not-allowed disabled:opacity-75"
              onClick={() => navigate("prev")}
            >
              Prev
            </button>
          </div>
          <div
            className="mx-auto max-h-screen w-full max-w-[70%] overflow-y-auto px-6 pb-28"
            dangerouslySetInnerHTML={createMarkup(staticMarkup[currentIdx])}
          >
            {/* Event listeners will work here if we parse clients side */}

            {/* statefulness doesn't work parsing server side: */}
            {/* {staticMarkup[currentIdx]} */}
          </div>
          <div className="flex-grow">
            <button
              disabled={currentIdx === staticMarkup.length - 1}
              className="sticky top-0 mr-auto block h-screen w-24 bg-color-gray disabled:cursor-not-allowed disabled:opacity-75"
              onClick={() => navigate("next")}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  async function fetchHtmlContent(slug: string) {
    try {
      console.log(`I am fetching ${slug}`);
      // let fetchSlug = `https://read.bibletranslationtools.org/u/${slug}`;
      let fetchSlug = `https://read.bibletranslationtools.org/u/${slug}`;
      // debugger
      let response = await fetch(fetchSlug);
      if (!response.ok) {
        throw new Error("Fetch not ok");
      }
      let data = await response.text();
      // let final = [];
      // let test = parse(data);

      let justScripture = data.split(
        '<div class="col-md-6" role="main" id="outer-content">'
      )[1];
      let chapters = justScripture.split(/<div id="ch-\d+" class="chapter">/);
      let currentIdx = 0;
      const options: HTMLReactParserOptions = {
        replace: (domNode) => {
          if (domNode instanceof Element && domNode.attribs) {
            // ...
            if (domNode.attribs.class === "versemarker") {
              // @ts-ignore:
              let verseNum = domNode.children[0]?.data;
              return (
                <VerseMarker id={`ch-${currentIdx}-v-${verseNum}`}>
                  {domToReact(domNode.children, options)}
                </VerseMarker>
              );
            }
            if (domNode.attribs.class === "chaptermarker") {
              // let chapterNum = domNode.children[0].data;

              return (
                <ChapterMarker>
                  {domToReact(domNode.children, options)}
                </ChapterMarker>
              );
            }
            if (domNode.attribs.class === "verse") {
              return <Verse>{domToReact(domNode.children, options)}</Verse>;
            }
            if (domNode.name === "p" && domNode.children?.length === 1) {
              return <Spacer />;
            }
            if (domNode.attribs.class === "footnotes") {
              return (
                <Footnotes>{domToReact(domNode.children, options)}</Footnotes>
              );
            }
          }
        },
      };
      const chapArray: Array<any> = chapters.map((chapter) => {
        // let data = parse(chapter, options);
        currentIdx += 1;
        return chapter;
        return data;
      });
      // const staticMarkup = toReact.map(renderToStaticMarkup(toReact));
      const staticMarkup = chapArray.map((chunk) => {
        console.log(chunk);
        return chunk;
        // return renderToStaticMarkup(chunk);
      });
      // console.log(toReact)
      return {
        justScripture2: chapters,
        staticMarkup,
        regenerationTimestamp: new Date().toLocaleString(),
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  try {
    let data;
    if (params && params.slug && Array.isArray(params.slug)) {
      let properSlug = params.slug.join("/");
      data = await fetchHtmlContent(properSlug);
    }
    if (params && params.slug && !Array.isArray(params.slug)) {
      data = await fetchHtmlContent(params.slug);
    }
    // const thesePaths = await api.cache.getAllPaths();
    const thesePaths = localPaths;
    // const paths = thesePaths ? thesePaths : await api.fetchAllRepoPaths();
    const paths = thesePaths;
    if (!data) {
      return {
        notFound: true,
      };
    }
    return { props: { data, paths } };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  // const localPaths = await api.cache.getAllPaths();
  // const localPaths = localPaths
  // todo; change local paths to go to '/u/author/repoName
  // const paths = localPaths ? localPaths : await api.fetchAllRepoPaths();
  // gitea:
  // jdwood/-x-antambahoaka_1th_text_reg = full name
  // html repo = current paths:  Push to an [{path, fullName}]

  // await api.cache.set(paths);

  // const paths = ['/u/WycliffeAssociates/en_ulb/'];
  // Get the paths we want to pre-render based on users

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths: localPaths, fallback: "blocking" };
};
