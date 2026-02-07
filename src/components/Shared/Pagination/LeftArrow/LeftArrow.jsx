import { IconArrowLeft } from "@tabler/icons-react";

function LeftArrow({ currentPage, handlePageClick }) {
    return (
        <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
        >
            <IconArrowLeft style={{ color: 'hsl(var(--foreground))' }}/>
        </button>
    )
}

export default LeftArrow