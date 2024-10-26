import { NotionAPI } from "notion-client";

const notion = new NotionAPI();

export async function getNotionData({ pageId }: { pageId: string }) {
  const recordMap = await notion.getPage(pageId);
  return recordMap;
}
