'use client';

import DigitalClock from '@/components/DigitalClock';
import MeetingTypeList from '@/components/MeetingTypeList';
import { useUser } from '@clerk/nextjs';

const Home = () => {

  const {user} = useUser();

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>
            Welcome, {`${user?.username}!`}
          </h2>
          
          <DigitalClock />

        </div>
      </div>

      <MeetingTypeList />

    </section>
  )
}

export default Home