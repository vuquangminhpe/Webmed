import { useNavigate } from 'react-router-dom'
import { HomeIcon, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import path from '@/constants/path'

const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const searchInput = form.elements.namedItem('search') as HTMLInputElement
    const searchQuery = searchInput.value.trim()

    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className='container flex h-[calc(100vh-200px)] flex-col items-center justify-center'>
      <div className='mx-auto flex max-w-md flex-col items-center justify-center space-y-6 text-center'>
        <div className='relative text-7xl font-bold'>
          <span className='text-primary'>4</span>
          <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
            <img src='/assets/heart-pulse.svg' alt='0' className='h-16 w-16 animate-pulse' />
          </span>
          <span className='text-primary'>4</span>
        </div>

        <h1 className='text-2xl font-bold'>Page Not Found</h1>

        <p className='text-muted-foreground'>
          We couldn't find the page you're looking for. It may have been moved, deleted, or never existed.
        </p>

        <form onSubmit={handleSearch} className='w-full'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input name='search' type='search' placeholder='Search for something else...' className='pl-10' />
          </div>
        </form>

        <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go Back
          </Button>

          <Button onClick={() => navigate(path.home)}>
            <HomeIcon className='mr-2 h-4 w-4' />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
