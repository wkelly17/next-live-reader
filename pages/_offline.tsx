import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

function Fallback() {
  const [savedPaths, setSavedPaths] = useState([]);
  useEffect(() => {
    /* Check all perhaps alter */
    /* https://stackoverflow.com/questions/53360988/service-worker-list-all-urls-in-cache-and-pass-to-another-function */
    async function listCachedLocally() {
      let corresponding = await caches.open("others-test1");
      if (corresponding) {
        let cacheKeys: any = await corresponding.keys();
        debugger;
        setSavedPaths(cacheKeys);
      }
    }
    listCachedLocally();
  }, []);
  return (
    <>
      <Head>
        <title>next-pwa example</title>
      </Head>
      <h1>This is offline fallback page</h1>
      <h2>When offline, any page route will fallback to this page</h2>
      <p>Here are the listing of all pages again.</p>
      <Link href={"/u"} prefetch={false}>
        <a className="block w-max text-blue-500 hover:underline">
          See all repos
        </a>
      </Link>
      {savedPaths &&
        savedPaths.map((req: any) => {
          return (
            <Link key={req.url} href={req.url} prefetch={false}>
              <a className="block w-max text-blue-500 hover:underline">
                {req.url}
              </a>
            </Link>
          );
        })}
    </>
  );
}

export default Fallback;
