import { DataTableRowActions } from "@/components/layout/CRUD/dataTable/dataTableRowActions";
import { IconArchive, IconEdit, IconEye } from "@tabler/icons-react";

function SubcategoryActionsMenu({ row, setTargetID, setShowArchiveModal, setShowItem, setShowUpdateForm }) {
    const item = row.original;
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
    ];
    return (
        <DataTableRowActions actions={actions} />
    )
}

export default SubcategoryActionsMenu
