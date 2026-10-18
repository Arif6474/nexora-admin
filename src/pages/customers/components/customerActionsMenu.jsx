import { useNavigate } from "react-router-dom";
import { DataTableRowActions } from "@/components/layout/CRUD/dataTable/dataTableRowActions";
import { IconArchive, IconEdit, IconEye, IconShoppingBag } from "@tabler/icons-react";

function CustomerActionsMenu({ row, setTargetID, setShowArchiveModal, setShowItem, setShowUpdateForm }) {
    const item = row.original;
    const navigate = useNavigate();

    const actions = [
        {
            label: 'Customer Orders',
            onClick: () => {
                navigate(`/customer-orders/${item._id}`);
            },
            icon: IconShoppingBag,
        },
        {
            label: 'View Customer Info',
            onClick: () => {
                setTargetID(item._id);
                setShowItem(true);
            },
            icon: IconEye,
        },
        {
            label: 'Edit Info',
            onClick: () => {
                setTargetID(item._id);
                setShowUpdateForm(true);
            },
            icon: IconEdit,
        },
        {
            label: item.isActive ? 'Archive' : 'Unarchive',
            onClick: () => {
                setTargetID(item._id);
                setShowArchiveModal(true);
            },
            icon: IconArchive,
        },
    ];

    return (
        <DataTableRowActions actions={actions} />
    );
}

export default CustomerActionsMenu;
