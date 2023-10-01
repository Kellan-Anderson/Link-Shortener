import { eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "~/server/db";
import { linkTable } from "~/server/schema";
import { redirect } from "next/navigation";

export default async function ShortLinkPage({ params } : { params: { shortLink: string }}) {
  const linkData = await db.query.linkTable.findFirst({ where: eq(linkTable.alias, params.shortLink) });

  if(!linkData) {
    return (
      <h1>No link found here. <Link href='/'>Go to home</Link></h1>
    );
  }

  redirect(linkData.link);
}