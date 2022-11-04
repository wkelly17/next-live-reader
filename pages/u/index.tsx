import Link from "next/link";
import { GetStaticProps } from "next";
// import api from "../api/api";
import localPaths from "../../paths";
import Fuse from "fuse.js";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface Props {
  paths: Array<string>;
}

export default function Page({ paths }: Props) {
  const router = useRouter();

  const options = {
    includeScore: true,
  };

  async function cacheMeOutside(event: any, path: string) {
    event.preventDefault();
    const fullPath = window.location.origin.concat(path);
    const cache = await caches.open("user-saved");
    // debugger;
    console.log("SAVING TO CACHE HTML PAGE");
    let response;
    try {
      response = await fetch(`${fullPath}`, {
        headers: new Headers({
          "X-Save-Request": "true",
        }),
      });
    } catch (error) {
      console.warn(error);
    }
    // fetch json representation of the route:
    console.log("PREFETCHING TO TRY TO SAVE JSON CORRESPONDING PAGE");
    router.prefetch(window.location.origin.concat(path));
    // debugger;
    if (response) {
      const data = response.text();
    }
    // debugger;
    const didSucceed = await cache.add(fullPath);
    // debugger;
  }

  // const fuse = new Fuse(list, options)
  useEffect(() => {
    if (!paths) {
      router.push("/_offline");
      return;
    }
  }, [paths, router]);

  if (!paths) {
    return null;
  }
  return (
    <>
      <div className="font-sans">
        <header>List of all</header>
        <div className="flex gap-8">
          {/* INTERNAL LINKS */}
          <div>
            <h2 className="mb-4 bg-gray-100 font-bold">
              These are hover pre-fetched internal links
            </h2>
            {paths.map((path) => {
              return (
                <>
                  <Link href={path} prefetch={false}>
                    <a className="block w-max text-blue-500 hover:underline">
                      {path}
                    </a>
                  </Link>
                  {/* todo: https://dev.to/iamludal/custom-react-hooks-usenetworkstate-1kj6 */}
                  {/* todo:  only show these caching buttons when window.navigatior online */}
                  <button onClick={(e) => cacheMeOutside(e, path)}>
                    {" "}
                    Cache this route!{" "}
                  </button>
                </>
              );
            })}
          </div>
          {/* EXTERNAL */}
          <div>
            <h2 className="mb-4 bg-gray-100 font-bold">
              These are external links
            </h2>
            {paths.map((path) => {
              return (
                <>
                  <div>
                    <a
                      href={path}
                      className="block w-max text-blue-500 hover:underline"
                    >
                      {path}
                    </a>
                    {/* todo: https://dev.to/iamludal/custom-react-hooks-usenetworkstate-1kj6 */}
                    {/* todo:  only show these caching buttons when window.navigatior online */}
                    <button onClick={(e) => cacheMeOutside(e, path)}>
                      {" "}
                      Cache this route!{" "}
                    </button>
                  </div>
                </>
              );
            })}
          </div>
          <div className="mt-8 bg-gray-200">
            <h2>Some pages that have not been generated at all</h2>
            {/* // read/gibson/ont_luk_text_reg/
// read/WycliffeAssociates/en_ulb
// read/lversaw/en_
// read/Carnicero/gl_jhn_text_reg/
// read/andriatiana_wa/tdx-x-mahafaly_dan_text_reg/ */}
            <div className="flex flex-col gap-4">
              <a
                href={"u/gibson/ont_luk_text_reg/"}
                className="block w-max text-blue-500 hover:underline"
              >
                u/gibson/ont_luk_text_reg/
              </a>
              <a
                href={"u/WycliffeAssociates/en_ulb"}
                className="block w-max text-blue-500 hover:underline"
              >
                u/WycliffeAssociates/en_ulb
              </a>
              <a
                href={"u/Carnicero/gl_jhn_text_reg/"}
                className="block w-max text-blue-500 hover:underline"
              >
                u/Carnicero/gl_jhn_text_reg/
              </a>
              <a
                href={"u/andriatiana_wa/tdx-x-mahafaly_dan_text_reg"}
                className="block w-max text-blue-500 hover:underline"
              >
                u/andriatiana_wa/tdx-x-mahafaly_dan_text_reg
              </a>
            </div>
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
  // const localPaths = await api.cache.getAllPaths();
  // todo; change local paths to go to '/u/author/repoName
  // const paths = localPaths ? localPaths : await api.fetchAllRepoPaths();
  const paths = localPaths;
  return { props: { paths } };
};
