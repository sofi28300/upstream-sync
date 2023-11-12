export const removeHtmlTags = (htmlString: string): string => {
  return htmlString
    .replace(/<[^>]*>/g, " ")
    .trim()
    .replace(/\s+/g, " ");
};
