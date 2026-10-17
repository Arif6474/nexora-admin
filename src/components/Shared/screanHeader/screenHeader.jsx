import Back from "../Back/Back";
import CreateButton from "./components/createButton";
import ItemsTitle from "./components/itemsTitle";
import HeaderSearchFilter from "./components/HeaderSearchFilter";

function ScreenHeader({
    isTitle = true,
    isCreate = false,
    title,
    setShowCreateForm,
    btnText,
    isBack = false,
    isSearch = false,
    search,
    setSearch,
    searchPlaceholder = 'Search...',
    isFilter = false,
    filter,
    setFilter,
    filterData,
    isSelect = false,
    selectData,
}) {
    return (
        <div className='mb-4 flex items-center justify-between space-y-2 top-2 sticky z-30'>
            <div className="flex items-center space-x-2">
                {isBack && <Back />}
                {isTitle && <ItemsTitle title={title} />}
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5">
                {(isSearch || isFilter) && (
                    <HeaderSearchFilter
                        title={title}
                        isSearch={isSearch}
                        search={search}
                        setSearch={setSearch}
                        searchPlaceholder={searchPlaceholder}
                        isFilter={isFilter}
                        filter={filter}
                        setFilter={setFilter}
                        filterData={filterData}
                        isSelect={isSelect}
                        selectData={selectData}
                    />
                )}
                {isCreate && (
                    <CreateButton
                        btnText={btnText}
                        setShowCreateForm={setShowCreateForm}
                    />
                )}
            </div>
        </div>
    );
}

export default ScreenHeader;