import { Button } from '@/components/custom/button';

function ArchiveButtons({ targetID, handleArchive, setShowArchiveModal , isActive }) {
    return (
        <div className="delete_btn">
            <Button
                onClick={() => handleArchive(targetID)}
                className='delete mt-4 w-full'
            >
                {isActive ? 'Archive' : 'Unarchive'}
            </Button>
            {/* <Button
                className='cancel bg-red-500'
                onClick={() => setShowArchiveModal(false)}
            >
                Cancel
            </Button> */}
        </div>
    );
}

export default ArchiveButtons;
