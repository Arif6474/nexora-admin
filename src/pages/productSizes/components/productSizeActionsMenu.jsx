import { DataTableRowActions } from "@/components/layout/CRUD/dataTable/dataTableRowActions";
import { IconArchive, IconEdit, IconEye, IconFileOrientation } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function ProductSizeActionsMenu({ row, setTargetID, setShowArchiveModal, setShowItem, setShowUpdateForm }) {
    const productSize = row.original;
    const navigate = useNavigate()
    const actions = [

        {
            label: 'Edit',
            onClick: () => {
                setTargetID(productSize._id);
                setShowUpdateForm(true);
            },
            icon: IconEdit,
        },

        {
            label: productSize.isActive ? 'Archive' : 'Unarchive',
            onClick: () => {
                setTargetID(productSize._id);
                setShowArchiveModal(true);
            },
            icon: IconArchive,

        },

    ];
    return (
        <DataTableRowActions actions={actions} />
    )
}

export default ProductSizeActionsMenu