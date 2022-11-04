import Link from "next/link";
import { useState, useEffect } from "react";
export default function DebugPage() {
  const [swCacheData, setSwCacheData] = useState(null);

  useEffect(() => {
    console.log("running useef");
    window.allCacheData = [];
    async function mapAllSwData(allCacheKeys) {
      let arr = allCacheKeys.map(async function (swCacheName) {
        let topArrOb = {
          name: swCacheName,
          contents: [],
        };
        let thisCache = await caches.open(swCacheName);
        console.log({ thisCache });
        const allResp = await thisCache.matchAll();
        console.log({ allResp });
        allResp.forEach((resp) => {
          topArrOb.contents.push({
            request: resp,
            date: resp.headers?.get("date"),
          });
        });
        window.allCacheData.push(topArrOb);
        return topArrOb;
      });

      return arr;
    }
    async function getSwData() {
      let allCacheKeys = await caches.keys();
      let arr = mapAllSwData(allCacheKeys);
    }
    getSwData();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setSwCacheData(window.allCacheData);
    }, [3000]);
  }, []);

  if (!swCacheData) {
    return (
      <div className="grid min-h-screen place-content-center p-12">
        Loading SW data
      </div>
    );
  }
  return (
    <div className="grid min-h-screen place-content-center p-12">
      {swCacheData &&
        swCacheData.length &&
        swCacheData.map((cache, idx) => {
          return (
            <div key={idx} className="py-8">
              <h1 className="bold text-xl text-green-500">{cache.name}</h1>
              <ul>
                {cache.contents?.map((content, index) => {
                  return (
                    <li key={index} className="py-2">
                      Req Date: {content.date}
                      <p>Url: {content.request.url}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
    </div>
  );
}
