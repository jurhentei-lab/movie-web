export function getVisiblePages(currentPage, totalPages) {
  const safeTotalPages = Math.max(1, Math.min(totalPages || 1, 500));
  const pages = [];

  for (let page = 1; page <= safeTotalPages; page += 1) {
    if (
      page === 1 ||
      page === safeTotalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
    ) {
      pages.push(page);
      continue;
    }

    if (page === currentPage - 2 || page === currentPage + 2) {
      pages.push("ellipsis");
    }
  }

  return pages.filter(
    (item, index, array) => item !== "ellipsis" || array[index - 1] !== "ellipsis"
  );
}
