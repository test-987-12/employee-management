import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight, FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Badge from './Badge';

/**
 * Modern, professional Table component with sorting, filtering, and pagination
 */
const Table = ({
  columns = [],
  data = [],
  pagination = true,
  pageSize = 10,
  search = true,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
  striped = true,
  hoverable = true,
  bordered = false,
  rounded = true,
  compact = false,
}) => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // State for searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Update filtered data when search term or data changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = data.filter(item => {
      // If searchKeys are provided, only search in those keys
      if (searchKeys.length > 0) {
        return searchKeys.some(key => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(searchTermLower);
        });
      }

      // Otherwise, search in all keys
      return Object.values(item).some(value =>
        value && String(value).toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, data, searchKeys]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';

    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ key, direction });
  };

  // Sort data
  const sortedData = sortConfig.key
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue > bValue ? 1 : -1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      })
    : filteredData; // If no sorting is applied, preserve the original order

  // Paginate data
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData;

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Base classes
  const tableClasses = `min-w-full divide-y divide-gray-200 ${className}`;
  const tableContainerClasses = `overflow-x-auto ${rounded ? 'rounded-lg' : ''} ${bordered ? 'border border-gray-200' : ''}`;

  // Row classes
  const rowClasses = `${hoverable ? 'hover:bg-gray-50' : ''} ${onRowClick ? 'cursor-pointer' : ''}`;

  // Cell classes
  const cellClasses = `${compact ? 'px-3 py-2' : 'px-6 py-4'} whitespace-nowrap text-sm text-gray-500`;

  // Header cell classes
  const headerCellClasses = `${compact ? 'px-3 py-2' : 'px-6 py-3'} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`;

  return (
    <div className="flex flex-col">
      {/* Search and pagination controls */}
      {(search || pagination) && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          {/* Search */}
          {search && (
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          )}

          {/* Items per page */}
          {pagination && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Show</span>
              <select
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className={tableContainerClasses}>
        <table className={tableClasses}>
          {/* Table header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`${headerCellClasses} ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="inline-flex flex-col">
                        <FiChevronUp
                          className={`h-3 w-3 -mb-1 ${
                            sortConfig.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-primary-500'
                              : 'text-gray-400'
                          }`}
                        />
                        <FiChevronDown
                          className={`h-3 w-3 ${
                            sortConfig.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-primary-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading state
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${rowClasses} ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={cellClasses}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of{' '}
            {sortedData.length} entries
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and pages around current page
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, array) => {
                // Add ellipsis if there are gaps
                const prevPage = array[index - 1];
                const showEllipsisBefore = prevPage && page - prevPage > 1;

                return (
                  <div key={page}>
                    {showEllipsisBefore && (
                      <span className="px-3 py-1">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  search: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onRowClick: PropTypes.func,
  className: PropTypes.string,
  striped: PropTypes.bool,
  hoverable: PropTypes.bool,
  bordered: PropTypes.bool,
  rounded: PropTypes.bool,
  compact: PropTypes.bool,
};

export default Table;
