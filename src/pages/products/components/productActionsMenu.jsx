import { DataTableRowActions } from "@/components/layout/CRUD/dataTable/dataTableRowActions";
import { IconArchive, IconClothesRack, IconEdit, IconEye, IconFileOrientation, IconPhoto } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function ProductActionsMenu({ row, setTargetID, setShowArchiveModal, setShowItem, setShowUpdateForm }) {
    const product = row.original;
    const navigate = useNavigate()
    const actions = [
        {
            label: 'View Product',
            onClick: () => {
                setTargetID(product._id);
                setShowItem(true);
            },
            icon: IconEye,
        },
        {
            label: 'Edit',
            onClick: () => {
                setTargetID(product._id);
                setShowUpdateForm(true);
            },
            icon: IconEdit,
        },

        {
            label: product.isActive ? 'Archive' : 'Unarchive',
            onClick: () => {
                setTargetID(product._id);
                setShowArchiveModal(true);
            },
            icon: IconArchive,

        },
        {
            label: 'Product Colors',
            onClick: () => {
                navigate(`/product-colors/${product._id}`)
            },
            icon: IconFileOrientation,
        },
        {
            label: 'Product Sizes',
            onClick: () => {
                navigate(`/product-sizes/${product._id}`)
            },
            icon: IconClothesRack,
        },
        {
            label: 'Product Images',
            onClick: () => {
                navigate(`/product-images/${product._id}`)
            },
            icon: IconPhoto,
        },

    ];
    return (
        <DataTableRowActions actions={actions} />
    )
}

export default ProductActionsMenu