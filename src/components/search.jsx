import { Input } from '@/components/ui/input'

export function Search({  setSearch }) {

  return (
    <div>
      <Input
        type='search'
        placeholder='Search...'
        className='md:w-[100px] lg:w-[300px]'
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>
  )
}
// import { Input } from '@/components/ui/input'

// export function Search({ table }) {

//   return (
//     <div>
//       <Input
//         type='search'
//         placeholder='Search...'
//         className='md:w-[100px] lg:w-[300px]'
//         value={(table.getColumn('name')?.getFilterValue()) ?? ''}
//         onChange={(event) =>
//           table.getColumn('name')?.setFilterValue(event.target.value)
//         }
//       />
//     </div>
//   )
// }
