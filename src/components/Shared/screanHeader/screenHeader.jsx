import Back from "../Back/Back"
import CreateButton from "./components/createButton"
import ItemsTitle from "./components/itemsTitle"

function ScreenHeader({
    isTitle = true, isCreate = false,
    title, setShowCreateForm, btnText,
    isBack = false
}) {
    return (
        <div className='mb-2 flex items-center justify-between space-y-2 top-2 sticky'>
            <div className="flex items-center space-x-2">
                {isBack && <Back />}
                {isTitle && <ItemsTitle title={title} />}
            </div>
            {isCreate &&
                <CreateButton
                    btnText={btnText}
                    setShowCreateForm={setShowCreateForm}
                />}
        </div>
    )
}

export default ScreenHeader