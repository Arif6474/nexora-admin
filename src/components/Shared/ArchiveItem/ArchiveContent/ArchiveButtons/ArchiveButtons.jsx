import { Button } from '@/components/custom/button';

function ArchiveButtons({ targetID, handleArchive, setShowArchiveModal, isActive }) {
    return (
        <div className="delete_btn">
            <Button
                variant={isActive ? 'destructive' : 'default'}
                onClick={() => handleArchive(targetID)}
                className='mt-4 w-full'
            >
                {isActive ? 'Archive' : 'Unarchive'}
            </Button>
        </div>
    );
}

export default ArchiveButtons;
