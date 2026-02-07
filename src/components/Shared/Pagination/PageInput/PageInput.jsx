

function PageInput({ currentPage, handlePageClick, totalPages }) {
    return (
        <input
            style={{
                textAlign: 'center',
                maxWidth: "60px",
                marginLeft: "auto",
                marginBottom: 0,
                color: 'hsl(var(--foreground))'
            }}
            className="bg-transparent border border-border rounded-md flex justify-center pl-2 py-1"
            type="number"
            value={currentPage}
            onChange={(e) => handlePageClick(parseInt(e.target.value))}
            max={parseInt(totalPages)}
            min={1}
        />

    )
}

export default PageInput