export const config = {
  runtime: "experimental-edge",
};
export default async function handler(req: any, res: any) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    console.log("REVALIDATING");
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    const path = req.query.path;
    // todo: It is possible to hit an api endpoint Reuben exposes to verify said repo exists in Wacs before attempting to revalidate;
    // let isValid = await isValidRepo(path);
    let isValid = true;
    if (!isValid) {
      return res
        .status(400)
        .json({ revalidated: false, message: "not a repo" });
    } else {
      await res.revalidate(`/u/${path}`); //no returns
      return res.json({ revalidated: true });
    }
    // http://localhost:8080/api/CheckRepoExists?url=https://content.bibletranslationtools.org/WA-Catalog/es-419_ulb
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}

async function isValidRepo(path: string) {
  console.log("checking with Reuben if valid");
  try {
    let response = await fetch(
      `http://localhost:8080/api/CheckRepoExists?url=https://content.bibletranslationtools.org/${path}`
    );
    let status = await response.json();
    console.log(status);
    return status;
  } catch (error) {
    return false;
  }
}
