import { Modal } from "../../../Shared/Modal/Modal"


function ShowCrudModal({
    modalHeading, setFilter, refetch, targetID,
    showCreateForm, setShowCreateForm, CreateItem,
    showItem, setShowItem, ViewItem,
    showUpdateForm, setShowUpdateForm, UpdateItem,
    showModal, setShowModal,
    commonTitle, UpdateCommonItem,
    parentID,
    maxWidth = {
        view: 600,
        create: 600,
        update: 600,
    }

}) {
    return (
        <>
            {showItem && (
                <Modal
                    maxWidth={maxWidth.view || (modalHeading === 'Order' ? 1080 : 600)}
                    modalHeading={`View ${modalHeading}`}
                    hideHeader={modalHeading === 'Order'}
                    setShowModalContent={setShowItem}
                    isOpen={showItem}
                >
                    <ViewItem
                        targetID={targetID}
                        setShowItem={setShowItem}
                        refetch={refetch}
                    />
                </Modal>
            )}
            {showCreateForm && (
                <Modal
                    maxWidth={maxWidth.create || (modalHeading === 'Order' ? 1080 : 600)}
                    modalHeading={`Create ${modalHeading}`}
                    setShowModalContent={setShowCreateForm}
                    isOpen={showCreateForm}
                >
                    <CreateItem
                        setShowCreateForm={setShowCreateForm}
                        setFilter={setFilter}
                        refetch={refetch}
                        parentID={parentID}
                    />
                </Modal>
            )}

            {showUpdateForm && (
                <Modal
                    maxWidth={maxWidth.update || (modalHeading === 'Order' ? 1080 : 600)}
                    modalHeading={`Update ${modalHeading}`}
                    setShowModalContent={setShowUpdateForm}
                    isOpen={showUpdateForm}
                   
                >
                    <UpdateItem
                        setShowUpdateForm={setShowUpdateForm}
                        targetID={targetID}
                        refetch={refetch}
                        parentID={parentID}

                    />
                </Modal>
            )}
            {showModal && (
                <Modal
                    maxWidth={550}
                    modalHeading={`${commonTitle}`}
                    setShowModalContent={setShowModal}
                    isOpen={showModal}
                >
                    <UpdateCommonItem
                        setShowModal={setShowModal}
                        targetID={targetID}
                    />
                </Modal>
            )}
        </>
    )
}

export default ShowCrudModal

