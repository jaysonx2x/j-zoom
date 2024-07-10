'use client';

import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useSearchParams } from 'next/navigation';

const MeetingSetup = ({setIsSetupComplete} : {setIsSetupComplete: (value: boolean) => void}) => {

    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
    const call = useCall();
    const {toast} = useToast();
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call?.id}`

    // const searchParams = useSearchParams();
    // const isPersonalRoom = !!searchParams.get('personal');

    if(!call) {
        throw new Error('usecall must be used within Streamcall component');
    }

    useEffect(() => {

        if(isMicCamToggledOn) {
            call?.camera.disable();
            call?.microphone.disable();
        } else {
            call?.camera.enable();
            call?.microphone.enable();
        }

    }, [isMicCamToggledOn, call?.camera, call?.microphone]);

    return (
        <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
            <h1 className='text-2xl font-bold'>Setup</h1>
            <VideoPreview />
            <div className='flex h-16 items-center justify-center gap-3'>
                <label className='flex items-center justify-center gap-2 font-medium'>
                    <input type='checkbox' checked={isMicCamToggledOn} 
                        onChange={(e) => setIsMicCamToggledOn(e.target.checked)} />
                        Join with mic and camera off
                </label>
                <DeviceSettings />
            </div>

            <div className='flex w-full items-center gap-2 flex-wrap justify-center'>

                <Button className='rounded-md bg-green-500 px-4 py-2.5'
                    onClick={() => {
                        call.join();
                        setIsSetupComplete(true);
                    } }>
                    Join Meeting
                </Button>

                { call?.isCreatedByMe && (
                    <Button className='rounded-md bg-blue-1 px-4 py-2.5' onClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({
                            title: "Link Copied",
                        });
                        } }>
                        Invitation Link
                    </Button>
                )}

            </div>

        </div>
    )
}

export default MeetingSetup