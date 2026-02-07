import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

function Filter({ filter, setFilter, filterData }) {

    return (
        <Tabs
            orientation='vertical'
            defaultValue='active'
            className='space-y-4'
            value={filter}
            onValueChange={(value) =>{
                setFilter(value)
            }}
        >
            <div className='w-full overflow-x-auto pb-2'>
                <TabsList>
                    {filterData.map((item) => (
                        <TabsTrigger value={item} key={item}>
                            {item}
                        </TabsTrigger>
                    ))}
                  
                </TabsList>
            </div>

        </Tabs>
    )
}

export default Filter