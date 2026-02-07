import { DataTableRowActions } from "@/components/layout/CRUD/dataTable/dataTableRowActions";
import { IconArchive, IconEdit, IconEye, IconFileOrientation } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function ProductColorActionsMenu({ row, setTargetID, setShowArchiveModal, setShowItem, setShowUpdateForm }) {
    const productColor = row.original;
    const navigate = useNavigate()
    const actions = [

        {
            label: 'Edit',
            onClick: () => {
                setTargetID(productColor._id);
                setShowUpdateForm(true);
            },
            icon: IconEdit,
        },

        {
            label: productColor.isActive ? 'Archive' : 'Unarchive',
            onClick: () => {
                setTargetID(productColor._id);
                setShowArchiveModal(true);
            },
            icon: IconArchive,

        },

    ];
    return (
        <DataTableRowActions actions={actions} />
    )
}

export default ProductColorActionsMenu