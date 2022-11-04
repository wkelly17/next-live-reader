export {};
// import { promises as fs } from 'fs';
// import path from 'path';

// const api = {
//   fetchAllRepoPaths: async () => {
//     let noMoreToFetch = false;
//     let currentPage = 0;
//     let allRepoPaths = [];
//     while (!noMoreToFetch) {
//       let promiseAllBatch = [];
//       for (let i = currentPage; i < currentPage + 20; i++) {
//         promiseAllBatch.push(getRepoPaths(i));
//       }

//       const everything = (await Promise.all(promiseAllBatch)).flat(Infinity);
//       console.log(everything);

//       currentPage += 20;
//       if (!everything.length || allRepoPaths.length > 50) {
//         noMoreToFetch = true;
//       } else {
//         allRepoPaths.push(...everything);
//       }
//     }
//     return allRepoPaths.map((url) => `/u/${url.repoName}`);
//     async function getRepoPaths(page: number) {
//       console.log(`starting fetch of ${page}`);
//       try {
//         let response = await fetch(
//           `https://content.bibletranslationtools.org/api/v1/repos/search/?page=${page}&limit=500`
//         );
//         let data = await response.json();
//         let arrRes = data.data;
//         let paths = arrRes.map(
//           (res: { html_url: string; full_name: string }) => {
//             return {
//               htmlUrl: res.html_url,
//               repoName: res.full_name,
//             };
//           }
//         );
//         return paths;
//       } catch (error) {
//         console.error(error);
//         return [];
//       }
//     }
//   },
//   repoContent: async (slug: string) => {
//     try {
//       // let fetchSlug = `https://read.bibletranslationtools.org/u/${slug}`;
//       let fetchSlug = `https://read.bibletranslationtools.org/u/${slug}.html`;
//       // debugger
//       let response = await fetch(fetchSlug);
//       let data = await response.text();
//       return {
//         data,
//       };
//     } catch (error) {
//       console.error(error);
//     }
//   },
//   cache: {
//     // todo: investigate, do I really need to have a local cache?  Not
//     // get: async (id: string): Promise<Product | null | undefined> => {
//     //   const data = await fs.readFile(path.join(process.cwd(), 'products.db'));
//     //   const products: Product[] = JSON.parse(data as unknown as string);

//     //   return products.find((product) => product.id === id);
//     // },
//     getAllPaths: async () => {
//       const data = await fs.readFile(path.join(process.cwd(), 'repos.db'));
//       let urls;
//       try {
//         urls = JSON.parse(data as unknown as string);
//       } catch (error) {
//         urls = undefined;
//       }
//       return urls;
//     },
//     set: async (urlsList: Array<string>) => {
//       return await fs.writeFile(
//         path.join(process.cwd(), 'repos.db'),
//         JSON.stringify(urlsList)
//       );
//     },
//   },
// };

// export default api;
