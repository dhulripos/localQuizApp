import Right from "../common/Images/greater-than.png";
import Left from "../common/Images/less-than.png";
import More from "../common/Images/More.png";

export default function Pagination({
  setPage,
  totalPages,
  currentPage,
  setRecoilPage,
}) {
  let array = [1, 2, 3, 4, "img", totalPages];

  if (totalPages <= 5) {
    array.splice(0, array.length);
    array = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage === 1 || currentPage === 2 || currentPage === 3) {
    array.splice(0, array.length, 1, 2, 3, 4, "img", totalPages);
  } else if (
    currentPage === totalPages - 1 ||
    currentPage === totalPages - 2 ||
    currentPage === totalPages
  ) {
    array.splice(
      0,
      array.length,
      1,
      "img",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
  } else {
    array.splice(
      0,
      array.length,
      1,
      "img",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "img",
      totalPages
    );
  }

  const goToPage = (pageNumber) => {
    setPage(pageNumber);
    setRecoilPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
      setRecoilPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
      setRecoilPage(currentPage + 1);
    }
  };

  return (
    <div>
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <img
                  src={Left}
                  alt=""
                  className={currentPage === 1 ? "darkened" : ""}
                  style={{
                    width: "40px",
                    height: "40px",
                    marginTop: "-5px",
                    filter: currentPage === 1 ? "brightness(50%)" : "none",
                  }}
                />
              </button>
            </li>
            {array.map((pageNumber, index) => (
              <li
                key={index}
                className={`page-item ${
                  pageNumber === currentPage ? "active" : ""
                }`}
              >
                {pageNumber === "img" ? (
                  <img
                    src={More}
                    alt="点点点"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginTop: "9px",
                    }}
                  />
                ) : (
                  <button
                    className="page-link"
                    style={
                      currentPage === pageNumber
                        ? { fontSize: "18px", background: "#99ccff" }
                        : { fontSize: "18px", background: "white" }
                    }
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )}
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <img
                  src={Right}
                  alt=""
                  style={{
                    width: "40px",
                    height: "40px",
                    marginTop: "-7px",
                    filter:
                      currentPage === totalPages ? "brightness(50%)" : "none",
                  }}
                />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
