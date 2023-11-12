export const removeHtmlTags = (htmlString: string): string => {
  return htmlString.replace(/<[^>]*>?/gm, "");
};
