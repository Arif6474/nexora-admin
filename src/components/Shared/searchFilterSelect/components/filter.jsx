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
                        <TabsTrigger
                            value={item}
                            key={item}
                            className="data-[state=active]:gold-active-gradient data-[state=active]:text-stone-950 data-[state=active]:font-bold data-[state=active]:shadow-sm rounded-md transition-all"
                        >
                            {item}
                        </TabsTrigger>
                    ))}
                  
                </TabsList>
            </div>

        </Tabs>
    )
}

export default Filter