import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Modal({
    isOpen,
    children,
    setShowModalContent,
    modalHeading,
    maxWidth = 425,
    hideHeader = false,
    className = ''
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setShowModalContent}>
            <DialogContent
                style={{ maxWidth: `${maxWidth}px` }}
                className={`max-h-[92vh] overflow-y-auto w-[96vw] rounded-3xl border border-stone-200/90 dark:border-[#1e2330] bg-white dark:bg-[#0c0e14] shadow-2xl ${
                    hideHeader ? 'p-0' : 'p-6'
                } ${className}`}
            >
                {!hideHeader && modalHeading ? (
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-start text-lg font-bold text-stone-900 dark:text-white">
                            {modalHeading}
                        </DialogTitle>
                    </DialogHeader>
                ) : (
                    <DialogTitle className="sr-only">
                        {modalHeading || 'Order Details'}
                    </DialogTitle>
                )}
                {children}
            </DialogContent>
        </Dialog>
    )
}
