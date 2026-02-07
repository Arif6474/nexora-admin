import { IconArrowRight } from "@tabler/icons-react";


function RightArrow({ currentPage, handlePageClick, totalPages }) {
    return (
        <button
            className="prev-next-btn"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage >= parseInt(totalPages)}>
            <IconArrowRight style={{ color: 'hsl(var(--foreground))' }}/>
        </button>

    )
}

export default RightArrow