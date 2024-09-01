import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { GoInfo } from 'react-icons/go';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

export default function RenderDialog({
    activity,
    editingState,
    title = 'Are you absolutely sure?',
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <GoInfo className="text-purple-500" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Textarea
                            className="resize-y h-96"
                            value={
                                editingState[activity.id]?.description ||
                                activity.description
                            }
                        />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/*<AlertDialogAction>Continue</AlertDialogAction>*/}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
