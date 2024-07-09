'use client';

import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from './ui/use-toast';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input';

const MeetingTypeList = () => {
  const {toast} = useToast();
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const {user} = useUser();

  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if(!user || !client) return;

    try {

      if(!values.dateTime) {
        toast({
          title: 'Please select a date and time!'
        });
      }

      const id = crypto.randomUUID();

      const call = client.call('default', id);

      if(!call) throw new Error('Failed to create call');

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();    
      const description = values.description || 'Instant Meeting';
    
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      });

      setCallDetails(call);

      if(!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: 'Meeting created!'
      });
      
    } catch(error) {
      console.log(error);
      toast({
        title: 'Failed to create meeting!'
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        
        <HomeCard 
            title='New Meeting' 
            subtitle='Setup a new recording'
            imgUrl='/icons/add-meeting.svg'
            bgColor='bg-orange-1'
            handleClick={() => setMeetingState('isInstantMeeting')}
             />

        <HomeCard 
            title='Join Meeting' 
            subtitle='Via invitation link'
            imgUrl='/icons/join-meeting.svg'
            bgColor='bg-blue-1'
            handleClick={() => setMeetingState('isJoiningMeeting')}
             />

        <HomeCard 
            title='Schedule Meeting' 
            subtitle='Plan your meeting'
            imgUrl='/icons/schedule.svg'
            bgColor='bg-purple-1'
            handleClick={() => setMeetingState('isScheduleMeeting')}
             />

        <HomeCard 
            title='View Recordings' 
            subtitle='Meeting recordings'
            imgUrl='/icons/recordings.svg'
            bgColor='bg-yellow-1'
            handleClick={() => router.push('/recordings') }
             />

        {!callDetails ? (
          <MeetingModal
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title='Create Meeting'
            handleClick={createMeeting}
          >
            <div className='flex flex-col gap-2.5'>
              <label className='text-base text-normal leading-[22px] text-sky-2'>
                Add a description
              </label>
              <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                onChange={(e) => {
                  setValues({...values, description: e.target.value})
                }}
              />
            </div>
            <div className='flex w-full flex-col gap-2.5'>
              <label className='text-base text-normal leading-[22px] text-sky-2'>
                Select Date & Time
              </label>
              <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setValues({...values, dateTime: date!})}
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={15}
                timeCaption='time'
                dateFormat='MMMM d, yyyy, h:mm aa'
                className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                />
            </div>
          </MeetingModal>
        ) : (
          <MeetingModal
              isOpen={meetingState === 'isScheduleMeeting'}
              onClose={() => setMeetingState(undefined)}
              title='Meeting Created'
              className='text-center mr-4'
              handleClick={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({title: 'Link copied!'});
              }}
              image='/icons/checked.svg'
              buttonIcon='/icons/copy.svg'
              buttonText='Copy Meeting Link'
          />
        )}

        <MeetingModal
            isOpen={meetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title='Start an Instant Meeting'
            buttonText='Start Meeting'
            className='text-center'
            handleClick={createMeeting}
        />

        <MeetingModal
            isOpen={meetingState === 'isJoiningMeeting'}
            onClose={() => setMeetingState(undefined)}
            title='Paste the link here'
            buttonText='Join Meeting'
            className='text-center'
            handleClick={() => router.push(values.link)}
        >
          <Input placeholder='Enter meeting Link'
            className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
            onChange={(e) => setValues({...values, link:e.target.value})}
            />

        </MeetingModal>

    </section>
  )
}

export default MeetingTypeList