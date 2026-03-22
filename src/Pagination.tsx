import ReactPaginateOriginal from "react-paginate";
import css from "./Pagination.module.css";

// Виправлення для сумісності Vite та CommonJS бібліотек (react-paginate)
const ReactPaginate =
  (
    ReactPaginateOriginal as unknown as {
      default: typeof ReactPaginateOriginal;
    }
  ).default || ReactPaginateOriginal;

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  forcePage: number;
}

const Pagination = ({
  pageCount,
  onPageChange,
  forcePage,
}: PaginationProps) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      previousLabel="<"
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
      forcePage={forcePage}
    />
  );
};

export default Pagination;
