import { useState } from "react";

function useCommonUtilities() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm,] = useState(false)
    const [showItem, setShowItem] = useState(false)
    const [showArchiveModal, setShowArchiveModal] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const [targetID, setTargetID] = useState('')

    return {
        showCreateForm,
        setShowCreateForm,
        showUpdateForm,
        setShowUpdateForm,
        showItem,
        setShowItem,
        showArchiveModal,
        setShowArchiveModal,
        showModal,
        setShowModal,
        targetID,
        setTargetID
    };
}

export default useCommonUtilities;