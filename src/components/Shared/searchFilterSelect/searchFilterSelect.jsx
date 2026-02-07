import { Search } from "@/components/search"
import Filter from "./components/filter"
import SearchSelectField from "../../ui/searchableSelect"
import { Form } from '@/components/ui/form';
import { useForm } from "react-hook-form";
function SearchFilterSelect({
    isSearch = true, isFilter = true, isSelect = false,
    setSearch, filter, setFilter, filterData, selectData
}) {
    const form = useForm();
    return (
        <div className="flex  gap-4 mt-4 flex-col md:flex-row top-14 sticky z-40">
            {isSearch && <Search setSearch={setSearch} />}
            {isFilter &&
                <Filter
                    filter={filter}
                    setFilter={setFilter}
                    filterData={filterData}
                />
            }
            {
                isSelect &&
                <Form {...form}>
                <SearchSelectField
                    // label={selectData.label}
                    value={selectData.value}
                    optionLabel={selectData.optionLabel}
                    optionValue={selectData.optionValue}
                    options={selectData.options}
                    placeholder={selectData.placeholder}
                    setState={selectData.setState}
                />
                </Form>
            }
        </div>
    )
}

export default SearchFilterSelect