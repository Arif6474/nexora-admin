import toast from 'react-hot-toast';
import { useState } from 'react';
import { useGetInfo } from "react-ninja-utils/hooks";
import useAxiosInstance from '../../../utils/Hooks/AxiosInstanceHooks/useAxiosInstance';
import ArchiveContent from './ArchiveContent/ArchiveContent';
import { Modal } from '../Modal/Modal';

function ArchiveItem({
    api, singleItemApi, targetID, setShowArchiveModal, showArchiveModal, text, refetch
}) {

    const axiosInstance = useAxiosInstance()
    const [toggleFetch, setToggleFetch] = useState(false)

    function triggerFetch() {
        setToggleFetch(!toggleFetch)
        refetch()
    }

    const { info: item } = useGetInfo({
        axiosInstance: axiosInstance,
        api: singleItemApi + targetID,
        toggleFetch
    });

    async function handleArchive(id) {

        const response = await axiosInstance.patch(api + id, { isActive: !item.isActive })
        console.log(response);
        if (response.status === 200) {
            setShowArchiveModal(false);
            triggerFetch()
            toast.success('Successfully updated!')
        }
    }

    return (
        <>
            {showArchiveModal && (
                <Modal
                    maxWidth={500}
                    modalHeading={`Archive ${text}`}
                    setShowModalContent={setShowArchiveModal}
                    isOpen={showArchiveModal}
                >
                    <ArchiveContent
                        isActive={item?.isActive}
                        targetID={targetID}
                        handleArchive={handleArchive}
                        setShowArchiveModal={setShowArchiveModal}
                        text={text}
                    />
                </Modal>
            )}
        </>
    )
}

export default ArchiveItem 