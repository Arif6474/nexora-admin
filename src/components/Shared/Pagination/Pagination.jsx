import ItemCounts from "./ItemCounts/ItemCounts";
import "./Pagination.css";
import LeftArrow from "./LeftArrow/LeftArrow";
import RightArrow from "./RightArrow/RightArrow";
import Page from "./Page/Page";
import PageInput from "./PageInput/PageInput";

function Pagination({ queryParams, setQueryParams, totalItems, items }) {
  const { currentPage = 1, limit = 20 } = queryParams || {};
  if (totalItems < 10) return null
  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (page) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      currentPage: page,
    }));
  };

  const generatePages = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <ItemCounts
        currentPage={currentPage}
        limit={limit}
        totalItems={totalItems}
        items={items}
      />

      <PageInput
        currentPage={currentPage}
        handlePageClick={handlePageChange}
        totalPages={totalPages}
      />

      <div className="pagination">
        <LeftArrow
          currentPage={currentPage}
          handlePageClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {generatePages().map((page, index) => (
          <Page
            key={index}
            page={page}
            currentPage={currentPage}
            handlePageClick={handlePageChange}
          />
        ))}

        <RightArrow
          currentPage={currentPage}
          handlePageClick={() => handlePageChange(currentPage + 1)}
          totalPages={totalPages}
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
}

export default Pagination;
