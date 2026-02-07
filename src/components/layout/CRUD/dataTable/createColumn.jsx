import { DataTableColumnHeader } from "./dataTableColumnHeader";

export const createColumn = ({ accessorKey, title = null, customCell = null, image = false }) => {
    const columnConfig = { accessorKey };

    // If a title is provided, set a custom header
    if (title) {
        columnConfig.header = ({ column }) => (
            <DataTableColumnHeader column={column} title={title} />
        );
    }

    // If a customCell is provided, use it
    if (customCell) {
        columnConfig.cell = ({ row }) => <div>{row.getValue(customCell)}</div>;
    }

    // If the image flag is set, override the customCell and show the image
    if (image) {
        columnConfig.cell = ({ row }) => (
            <img
                src={import.meta.env.VITE_REACT_APP_SPACES_URL + row.getValue(accessorKey)}
                alt={row.getValue('name')}
                className="w-10 h-10 rounded-md object-cover"
            />
        );
    }

    // Return the column configuration
    return columnConfig;
};
