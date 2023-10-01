import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { linkTable, linkTableParser } from "~/server/schema";

const handler = async (req: NextRequest) => {
  try {
    const newLink = linkTableParser.parse(await req.json());
    const linkExists = await db.query.linkTable.findFirst({
      where: eq(linkTable.alias, newLink.alias)
    }) !== undefined;
    if(linkExists) {
      return NextResponse.json({ message: 'Link by that alias already exists' }, { status: 400 })
    }
    await db.insert(linkTable).values(newLink);
    return NextResponse.json({ message: newLink.alias}, { status: 200 });
  } catch (e) {
    console.log('There was an error')
    console.log(e);
    return NextResponse.json({ message: 'There was an error' }, { status: 500 });
  }
}

export { handler as POST };