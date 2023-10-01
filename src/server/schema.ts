import { pgTable, serial, text, } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod"

export const linkTable = pgTable('link_table', {
  alias: text('alias').primaryKey(),
  link: text('link').notNull(),
});

export const linkTableParser = createInsertSchema(linkTable);