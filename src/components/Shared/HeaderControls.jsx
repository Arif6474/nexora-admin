import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import ThemeSwitch from "@/components/theme/themeSwitch"
import { UserNav } from "@/components/ui/userNav"

function HeaderControls({isSearch, fixed}) {
    return (
        <Layout.Header fixed={fixed}>
            <div className='ml-auto flex items-center space-x-4'>
                {isSearch && <Search />}
                <ThemeSwitch />
                <UserNav />
            </div>
        </Layout.Header>
    )
}

export default HeaderControls