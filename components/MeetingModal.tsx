import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import Image from "next/image";

import { ReactNode } from "react";
import { Button } from "./ui/button";
  

interface MeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    handleClick?: () => void;
    buttonText?: string;
    className?: string;
    children?: ReactNode;
    image?: string;
    buttonIcon?: string;
}

const MeetingModal = ({isOpen, onClose, title, buttonText, className, handleClick, image, buttonIcon, children} : MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
            <div className="flex flex-col gap-6">
                {image && (
                    <div className="flex justify-center">
                        <Image
                            src={image}
                            alt="image"
                            width={72}
                            height={72}
                        />
                    </div>
                )}

                <h1 className={cn('text-2xl font-bold leading-[42px]', className)}>{title}</h1>
                {children}

                <Button className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                 onClick={handleClick}>
                    {buttonIcon && (
                        <Image 
                            src={buttonIcon}
                            width={13}
                            height={13}
                            alt="Button Icon"
                         />
                    )}
                    {buttonText || 'Schedule Meeting'}
                </Button>

            </div>
        </DialogContent>
    </Dialog>

  )
}

export default MeetingModal