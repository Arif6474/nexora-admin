import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import ScreenWrapper from '@/components/Shared/screenWrapper';
import ScreenHeader from '@/components/Shared/screanHeader/screenHeader';
import useCommonUtilities from '../../utils/Hooks/useCommonUtilities';
import ShowCrudModal from '../../components/layout/CRUD/showCrudModal/showCrudModal';
import ArchiveItem from '../../components/Shared/ArchiveItem/ArchiveItem';
import { useGetTestimonialsQuery } from '../../redux/features/testimonials/testimonialApi';
import { createColumn } from '../../components/layout/CRUD/dataTable/createColumn';
import { DataTable } from '../../components/layout/CRUD/dataTable/dataTable';
import TestimonialActionsMenu from './components/testimonialActionsMenu';
import CreateTestimonial from './components/CreateTestimonial';
import ViewTestimonial from './components/ViewTestimonial';
import UpdateTestimonial from './components/UpdateTestimonial';
import Pagination from '@/components/Shared/Pagination/Pagination';
import { IconStar } from '@tabler/icons-react';

function Testimonials() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Active');
    const [queryParams, setQueryParams] = useState({ currentPage: 1, limit: 10 });
    const {
        showCreateForm, setShowCreateForm,
        showUpdateForm, setShowUpdateForm,
        showArchiveModal, setShowArchiveModal,
        showItem, setShowItem,
        targetID, setTargetID
    } = useCommonUtilities();

    const { data, isLoading, refetch } = useGetTestimonialsQuery({ search, filter, queryParams });
    const { documents = [], totalPages = 0, totalItems = 0 } = data ?? {};
    const filterData = ['Active', 'Archived'];

    useEffect(() => {
        refetch();
    }, [filter, refetch]);


    const columns = [
        {
            accessorKey: 'author',
            header: 'Author / Patron',
            cell: ({ row }) => {
                const item = row.original;
                const avatarSrc = item?.image?.startsWith('http')
                    ? item.image
                    : item?.image
                    ? `${import.meta.env.VITE_REACT_APP_SPACES_URL || ''}${item.image}`
                    : null;

                return (
                    <div className="flex items-center gap-3">
                        {avatarSrc ? (
                            <img
                                src={avatarSrc}
                                alt={item.author}
                                className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-[#222838] flex-shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 font-bold text-sm flex-shrink-0">
                                {item.author ? item.author.charAt(0).toUpperCase() : 'T'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-semibold text-sm text-stone-900 dark:text-white truncate">
                                {item.author}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-zinc-400 truncate">
                                {item.role || 'Verified Buyer'}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'content',
            header: 'Quote',
            cell: ({ row }) => (
                <p className="text-xs text-stone-600 dark:text-zinc-300 max-w-md line-clamp-2 italic font-serif">
                    "{row.original.content}"
                </p>
            ),
        },
        {
            accessorKey: 'rating',
            header: 'Rating',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-amber-500">
                    <IconStar size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-stone-800 dark:text-zinc-200">
                        {row.original.rating || 5}.0
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'size',
            header: 'Card Size',
            cell: ({ row }) => {
                const size = row.original.size || 'medium';
                const colorMap = {
                    small: 'bg-blue-500/15 text-blue-500 border-blue-500/25',
                    medium: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25',
                    large: 'bg-purple-500/15 text-purple-500 border-purple-500/25',
                };
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${colorMap[size] || colorMap.medium}`}>
                        {size}
                    </span>
                );
            },
        },
        {
            accessorKey: 'serial',
            header: 'Serial',
            cell: ({ row }) => (
                <span className="text-xs font-mono text-stone-500 dark:text-zinc-400">
                    #{row.original.serial ?? 1}
                </span>
            ),
        },
    ];

    return (
        <Layout fixed={true}>
            <ScreenWrapper>
                <ScreenHeader
                    title="Testimonials"
                    setShowCreateForm={setShowCreateForm}
                    btnText="Create Testimonial"
                    isCreate
                    isBack
                    isSearch={true}
                    search={search}
                    setSearch={setSearch}
                    searchPlaceholder="Search by author, role, or review..."
                    isFilter={true}
                    filter={filter}
                    setFilter={setFilter}
                    filterData={filterData}
                />
                <DataTable
                    data={documents}
                    columns={columns}
                    setTargetID={setTargetID}
                    setShowArchiveModal={setShowArchiveModal}
                    setShowUpdateForm={setShowUpdateForm}
                    setShowItem={setShowItem}
                    ItemActionsMenu={TestimonialActionsMenu}
                    isLoading={isLoading}
                />
                {!isLoading && (
                    <Pagination
                        totalPages={totalPages}
                        items={documents}
                        totalItems={totalItems}
                        queryParams={queryParams}
                        setQueryParams={setQueryParams}
                    />
                )}
            </ScreenWrapper>
            <ArchiveItem
                api={'testimonial/archiveTestimonial/'}
                singleItemApi={'testimonial/getSingleTestimonial/'}
                targetID={targetID}
                setShowArchiveModal={setShowArchiveModal}
                showArchiveModal={showArchiveModal}
                text={"Testimonial"}
                refetch={refetch}
            />
            <ShowCrudModal
                modalHeading="Testimonial"
                setFilter={setFilter}
                refetch={refetch}
                targetID={targetID}
                showCreateForm={showCreateForm}
                setShowCreateForm={setShowCreateForm}
                CreateItem={CreateTestimonial}
                showItem={showItem}
                setShowItem={setShowItem}
                ViewItem={ViewTestimonial}
                showUpdateForm={showUpdateForm}
                setShowUpdateForm={setShowUpdateForm}
                UpdateItem={UpdateTestimonial}
            />
        </Layout>
    );
}

export default Testimonials;
