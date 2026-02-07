
import './Back.css'
import { IconCircleArrowLeft } from '@tabler/icons-react'

function Back() {
  return (
    <IconCircleArrowLeft onClick={()=>history.back()} className='cursor-pointer text-muted-foreground' />
  )
}

export default Back