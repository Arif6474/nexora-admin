import { DataTableRowActions } from "@/components/layout/CRUD/dataTable/dataTableRowActions";
import { IconArchive, IconEdit, IconEye, IconFileOrientation } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function CategoryActionsMenu({ row, setTargetID, setShowArchiveModal, setShowItem, setShowUpdateForm }) {
    const item = row.original;
    const navigate = useNavigate()
    const actions = [
        {
            label: 'View Info',
            onClick: () => {
                setTargetID(item._id);
                setShowItem(true);
            },
            icon: IconEye,
        },
        {
            label: 'Edit',
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
        {
            label: 'Subcategories',
            onClick: () => {
                navigate(`/subcategories/${item._id}`)
            },
            icon: IconFileOrientation,
        },

    ];
    return (
        <DataTableRowActions actions={actions} />
    )
}

export default CategoryActionsMenu