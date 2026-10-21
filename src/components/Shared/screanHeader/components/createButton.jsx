import { Button } from '@/components/custom/button'
import { IconPlus } from '@tabler/icons-react'

function CreateButton({ setShowCreateForm, btnText }) {
    return (
        <Button
            type='button'
            variant='gold'
            onClick={() => setShowCreateForm(true)}
            className='w-10 h-10 p-0 rounded-full sm:w-auto sm:h-11 sm:px-5 sm:py-2.5 sm:rounded-xl shadow-md shrink-0 gap-1.5 inline-flex items-center justify-center cursor-pointer'
            title={btnText}
            aria-label={btnText}
        >
            <IconPlus size={18} stroke={2.5} className='shrink-0' />
            <span className='hidden sm:inline font-bold'>{btnText}</span>
        </Button>
    )
}

export default CreateButton