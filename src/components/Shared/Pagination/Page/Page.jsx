function Page({ page, currentPage, handlePageClick }) {
    return (
        <button
            onClick={() => page !== '...' && handlePageClick(page)}
            className={currentPage === page ? 'active' : ''}
            style={{
                color: 'hsl(var(--foreground))',
                backgroundColor: page === currentPage ? "hsl(var(--secondary))" : "transparent",
            }}
        >
            {page}
        </button>
    );
}

export default Page;
