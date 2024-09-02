'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/spinner/Spinner';
import { AiOutlineDelete } from 'react-icons/ai';
import { deleteData, getData } from '@/utilities/axios';

export default function AvatarUploadPage() {
    const inputFileRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApiData = async () => {
        try {
            const data = await getData('/api/v1/avatar/download');

            setFiles(data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);

        fetchApiData();
    }, []);

    const handleFileUploadClick = async (event) => {
        event.preventDefault();
        const file = inputFileRef.current.files?.[0];

        if (file) {
            const uploadPromise = fetch(
                `/api/v1/avatar/upload?filename=${file.name}`,
                {
                    method: 'POST',
                    body: file,
                }
            );

            toast.promise(uploadPromise, {
                loading: 'Uploading...',
                success: async (result) => {
                    if (result.ok) {
                        const response = await result.json();
                        console.log('File uploaded successfully:', response);
                        await fetchApiData(); // Refresh the list after successful upload
                        return 'File uploaded successfully.';
                    } else {
                        throw new Error('File upload failed.');
                    }
                },
                error: 'An error occurred while uploading the item.',
            });
        } else {
            toast.error('No file selected for upload.');
        }
    };

    const handleDeleteClick = async (url) => {
        const deletedPromise = deleteData(
            `/api/v1/avatar/delete?url=${url}`,
            ''
        );

        toast.promise(deletedPromise, {
            loading: 'Deleting...',
            success: (result) => {
                // Check if the delete operation was successful
                if (result.success) {
                    return result.message;
                } else {
                    throw new Error(result.message);
                }
            },
            error: 'An error occurred while Deleting the values.',
        });

        try {
            const result = await deletedPromise;
            if (result.success) {
                await fetchApiData();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return loading ? (
        <Spinner />
    ) : (
        <div>
            <Table>
                <TableCaption>A list of your uploaded files.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Preview</TableHead>
                        <TableHead className="w-[250px]">Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">
                            Upload Time
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {files &&
                        files.map((file) => (
                            <TableRow key={file.url}>
                                <TableCell>
                                    <img
                                        src={file.url}
                                        alt={`${file.pathname} image`}
                                    />
                                </TableCell>
                                <TableCell>{file.pathname}</TableCell>
                                <TableCell>
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {file.url}
                                    </a>
                                </TableCell>
                                <TableCell>{file.size}</TableCell>
                                <TableCell>{file.uploadedAt}</TableCell>
                                <TableCell className="text-right">
                                    <AiOutlineDelete
                                        className="cursor-pointer text-destructive text-lg"
                                        onClick={() =>
                                            handleDeleteClick(file.url)
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="ml-1" htmlFor="picture">
                    Upload Your File
                </Label>

                <div className="flex gap-4 mt-2">
                    <Input
                        id="picture"
                        name="file"
                        ref={inputFileRef}
                        type="file"
                        className="cursor-pointer"
                    />
                    <Button
                        size="xs"
                        className="text-xs p-1.5 px-25"
                        onClick={handleFileUploadClick}
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    );
}
