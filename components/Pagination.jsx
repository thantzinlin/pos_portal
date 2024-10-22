export default function Pagination({
  page,
  pageCounts,
  onPageChange,
  perPage,
  onPerPageChange,
}) {
  const visiblePages = 5;

  const handleSkip = (type) => {
    switch (type) {
      case "first":
        onPageChange(1);
        break;
      case "prev":
        onPageChange(Math.max(1, page - 1));
        break;
      case "next":
        onPageChange(Math.min(pageCounts, page + 1));
        break;
      case "last":
        onPageChange(pageCounts);
        break;
      default:
        break;
    }
  };

  const getVisiblePages = () => {
    if (pageCounts <= visiblePages) {
      return Array.from({ length: pageCounts }, (_, i) => i + 1);
    }

    const half = Math.floor(visiblePages / 2);
    if (page <= half) {
      return Array.from({ length: visiblePages }, (_, i) => i + 1);
    }

    if (page >= pageCounts - half) {
      return Array.from(
        { length: visiblePages },
        (_, i) => pageCounts - visiblePages + i + 1
      );
    }

    return Array.from({ length: visiblePages }, (_, i) => page - half + i);
  };

  return (
    <div className="flex items-center mt-4">
      <div className="flex justify-center items-center space-x-2 flex-grow">
        <button
          onClick={() => handleSkip("first")}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          First
        </button>

        <button
          onClick={() => handleSkip("prev")}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {page > visiblePages / 2 + 1 && <span className="px-3 py-1">...</span>}

        {getVisiblePages().map((pageNum) => (
          <button
            key={pageNum}
            className={`px-3 py-1 ${
              pageNum === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-lg hover:bg-gray-300`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}

        {page < pageCounts - visiblePages / 2 && (
          <span className="px-3 py-1">...</span>
        )}

        <button
          onClick={() => handleSkip("next")}
          disabled={page === pageCounts}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>

        <button
          onClick={() => handleSkip("last")}
          disabled={page === pageCounts}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Last
        </button>
      </div>
      <div className="flex items-center">
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          id="perPage"
          className="border rounded-lg p-1"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}

// export default function UserList() {
//   const [page, setPage] = useState(1);
//   const pageCounts = 20; // This should come from your API or be calculated based on total items

//   return (
//     <div>
//       {/* Your table here */}
//       <Pagination page={page} pageCounts={pageCounts} onPageChange={setPage} />
//     </div>
//   );
