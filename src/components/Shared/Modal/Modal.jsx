
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Modal({ isOpen, children, setShowModalContent, modalHeading, maxWidth = 425 }) {
    return (
        <Dialog open={isOpen} onOpenChange={setShowModalContent} >
            <DialogContent style={{ maxWidth: `${maxWidth}px` }} className='max-h-[90vh] overflow-auto w-[95vw]'>
                <DialogHeader>
                    <DialogTitle className='text-start'>{modalHeading}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
