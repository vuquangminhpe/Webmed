import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useProfile, useLogout } from '@/hooks/useAuth'
import path from '@/constants/path'
import { AlertCircle, Search, ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAccessTokenFromLS } from '@/utils/auth'

const Header = () => {
  const { data: user } = useProfile()
  const logout = useLogout()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthenticated = Boolean(getAccessTokenFromLS())

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background'>
      <div className='container flex h-16 items-center px-4 sm:px-6 lg:px-8'>
        <Link to={path.home} className='mr-6 flex items-center space-x-2'>
          <AlertCircle className='h-6 w-6 text-primary' />
          <span className='hidden font-bold sm:inline-block'>WebMed</span>
        </Link>

        <div className='hidden md:flex md:flex-1 md:items-center md:justify-between'>
          <nav className='flex items-center space-x-6'>
            <Link to={path.healthAZ} className='text-sm font-medium transition-colors hover:text-primary'>
              Health A-Z
            </Link>
            <Link to={path.medicines} className='text-sm font-medium transition-colors hover:text-primary'>
              Drugs & Supplements
            </Link>
            <Link to={path.doctors} className='text-sm font-medium transition-colors hover:text-primary'>
              Find a Doctor
            </Link>
            <Link to={path.feedback} className='text-sm font-medium transition-colors hover:text-primary'>
              Feedback
            </Link>
          </nav>

          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='icon'>
              <Search className='h-5 w-5' />
            </Button>

            <Link to={path.orders}>
              <Button variant='ghost' size='icon'>
                <ShoppingCart className='h-5 w-5' />
              </Button>
            </Link>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                      <p className='font-medium'>{user.name}</p>
                      <p className='text-xs text-muted-foreground'>{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(path.profile)}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(path.orders)}>My Orders</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout.mutate()}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='flex items-center space-x-2'>
                <Button variant='ghost' onClick={() => navigate(path.login)}>
                  Log in
                </Button>
                <Button onClick={() => navigate(path.register)}>Sign up</Button>
              </div>
            )}
          </div>
        </div>

        <div className='flex md:hidden'>
          <Button variant='ghost' size='icon' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden'>
          <div className='space-y-2 px-4 py-3'>
            <Link
              to={path.healthAZ}
              className='block rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
              onClick={() => setMobileMenuOpen(false)}
            >
              Health A-Z
            </Link>
            <Link
              to={path.medicines}
              className='block rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
              onClick={() => setMobileMenuOpen(false)}
            >
              Drugs & Supplements
            </Link>
            <Link
              to={path.doctors}
              className='block rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
              onClick={() => setMobileMenuOpen(false)}
            >
              Find a Doctor
            </Link>
            <Link
              to={path.feedback}
              className='block rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
              onClick={() => setMobileMenuOpen(false)}
            >
              Feedback
            </Link>

            <div className='border-t pt-4'>
              {isAuthenticated && user ? (
                <>
                  <div className='flex items-center px-3 py-2'>
                    <Avatar className='h-8 w-8 mr-3'>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{user.name}</p>
                      <p className='text-xs text-muted-foreground'>{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={path.profile}
                    className='block rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to={path.orders}
                    className='block rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    className='block w-full text-left rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
                    onClick={() => {
                      logout.mutate()
                      setMobileMenuOpen(false)
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={path.login}
                    className='block rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to={path.register}
                    className='block rounded-md px-3 py-2 text-base font-medium hover:bg-accent'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
