function ItemCounts({ currentPage, limit, totalItems , items }) {
    const startCount = (currentPage - 1) * limit + 1;
    const endCount = Math.min(currentPage * limit, totalItems);
  
    return (
      <div className="pagination-info" style={{ color: 'hsl(var(--foreground))' }}>
        <p>
          {totalItems > 20
            ? `Showing ${startCount} to ${endCount} of ${totalItems} entries`
            : `Showing ${totalItems} entries`}
        </p>
      </div>
    );
  }
  
  export default ItemCounts;
  