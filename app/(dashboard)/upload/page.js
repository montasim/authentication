'use client';

import React, { useState, useRef, useEffect } from 'react';
import { deleteData, getData } from '@/utilities/axios';
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

export default function AvatarUploadPage() {
    const inputFileRef = useRef(null);
    const [blob, setBlob] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApiData = async () => {
        try {
            const data = await getData('/api/v1/avatar/download');
            setFiles(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchApiData();
    }, []);

    const handleFileUploadClick = async (event) => {
        event.preventDefault();

        const file = inputFileRef.current.files?.[0];

        const response = await fetch(
            `/api/v1/avatar/upload?filename=${file.name}`,
            {
                method: 'POST',
                body: file,
            }
        );

        const newBlob = await response.json();

        setBlob(newBlob);

        await fetchApiData();
    };

    const handleDeleteClick = async (url) => {
        await deleteData(`/api/v1/avatar/delete?url=${url}`, '');

        await fetchApiData();
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
                                <TableCell>
                                    {(file.size / 1024).toFixed(2)} MB
                                </TableCell>
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
