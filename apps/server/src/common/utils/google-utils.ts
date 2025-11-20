export const extractFileId = (link: string): string | null => {
  const match = link.match(/\/file\/d\/(.+?)\//);
  return match ? match[1] : null;
};
