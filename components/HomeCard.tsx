import Image from 'next/image'
import React from 'react'

interface HomeCardProps {
    title: string, 
    subtitle: string, 
    imgUrl: string, 
    bgColor: string, 
    handleClick: () => void;
}

const HomeCard = ({title, subtitle, imgUrl, bgColor, handleClick} 
    : HomeCardProps ) => {
  return (
    <div className={`${bgColor} px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`}
        onClick={handleClick}>
        <div className='glassmorphism flex-center size-12 rounded-[10px]'>
            <Image
                src={imgUrl}
                width={27}
                height={27}
                alt='Add'
                />
        </div>
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            <p className='text-lg font-normal'>{subtitle}</p>
        </div>
    </div>
  )
}

export default HomeCard