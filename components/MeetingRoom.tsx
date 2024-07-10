import { cn } from '@/lib/utils';
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import Image from 'next/image';
  

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {

    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get('personal');

    const [layout, setLayout] = useState('speaker-left');
    const [showParticipants, setShowParticipants] = useState(false);
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const call = useCall();
    const {toast} = useToast();
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call?.id}`

    const router = useRouter();

    if(callingState !== CallingState.JOINED) return <Loader />

    const CallLayout = () => {
        switch(layout) {
            case 'grid': 
                return <PaginatedGridLayout />
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition='left' />
            default:
                return <SpeakerLayout participantsBarPosition='right' />
        }
    }

    return (
        <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
            <div className='relative flex size-full items-center justify-center'>
                <div className='flex size-full max-w-[1000px] items-center'>
                    <CallLayout />
                </div>
                <div className={cn('h-[calc(100vh-86px)] hidden ml-2', { 'show-block': showParticipants })}>
                    <CallParticipantsList onClose={() => setShowParticipants(false) } />
                </div>
            </div>

            <div className='fixed bottom-0 flex w-full items-center gap-5 flex-wrap'>

                <CallControls onLeave={() => router.push('/') } />

                <DropdownMenu>

                    <div className='flex items-center'>
                        <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                            <LayoutList size={20} className='text-white' />
                        </DropdownMenuTrigger>
                    </div>
                    
                    <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem className='cursor-pointer' onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}>
                                    {item}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='border-dark-1' />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <CallStatsButton />

                <button onClick={() => setShowParticipants((prev) => !prev)}>
                    <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                        <Users size={20} className='text-white' />
                    </div>
                </button>

                { !isPersonalRoom && <EndCallButton /> }

                <Button className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]' onClick={() => {
                    navigator.clipboard.writeText(meetingLink);
                    toast({
                        title: "Link Copied",
                    });
                    } } title='Copy Inviation Link'>
                    <Image src='/icons/copy.svg' 
                        width={20} height={20} alt='copy' />
                </Button>
            </div>

        </section>
    )
}

export default MeetingRoom