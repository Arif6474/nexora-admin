import { Button } from '@/components/custom/button'

function CreateButton({setShowCreateForm, btnText }) {
    return (
        <div className='flex items-center space-x-2' onClick={() => setShowCreateForm(true)} >
            <Button variant='gold' className='rounded-xl shadow-md'>{btnText}</Button>
        </div>
    )
}

export default CreateButton