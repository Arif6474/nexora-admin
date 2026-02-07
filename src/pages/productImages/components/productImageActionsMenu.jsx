import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Button } from '@/components/custom/button';
import { IconArchive, IconDots, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { useArchiveProductImageMutation, useDeleteProductImageMutation } from '../../../redux/features/productImages/productImageApi';

export default function ProductImageActionsMenu({
    row,
    setShowUpdateForm,
    setShowItem,
    setTargetID,
    refetch,
}) {
    const [archiveProductImage] = useArchiveProductImageMutation();
    const [deleteProductImage] = useDeleteProductImageMutation();

    const handleArchive = async () => {
        const result = await archiveProductImage({ id: row.original._id, isActive: !row.original.isActive });
        if (result.data) {
            toast.success(`Product Image ${row.original.isActive ? 'archived' : 'activated'} successfully!`);
            refetch();
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this product image?')) {
            const result = await deleteProductImage({ id: row.original._id });
            if (result.data) {
                toast.success('Product Image deleted successfully!');
                refetch();
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <IconDots className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => {
                        setShowItem(true);
                        setTargetID(row.original._id);
                    }}
                >
                    <IconEye className='mr-2 h-4 w-4' /> View
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setShowUpdateForm(true);
                        setTargetID(row.original._id);
                    }}
                >
                    <IconEdit className='mr-2 h-4 w-4' /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleArchive}>
                    <IconArchive className='mr-2 h-4 w-4' /> {row.original.isActive ? 'Archive' : 'Activate'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
                    <IconTrash className='mr-2 h-4 w-4' /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
