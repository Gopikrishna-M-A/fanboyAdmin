'use client'
import DashSwitcher from "../components/dashboard/dash-switcher"
import { MainNav } from "../components/dashboard/main-nav"
import { Search } from "../components/dashboard/search"
import { UserNav } from "../components/dashboard/user-nav"
import { ModeToggle } from "../components/mode-toggle";
import TeamSwitcher from "../components/dashboard/team-switcher"


const Layout = ({ children }) => {
  return (
    <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 ">
            {/* <DashSwitcher /> */}
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              {/* <UserNav /> */}
              <ModeToggle />
            </div>
          </div>
        </div>

        {children}
        
      </div>
  )
}

export default Layout