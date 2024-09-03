'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/spinner/Spinner';
import { AiOutlineDelete } from 'react-icons/ai';
import { createData, deleteData, getData } from '@/utilities/axios';
import { log } from 'next/dist/server/typescript/utils';

export default function BlockedEmailDomainsEditor() {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchApiData = async () => {
        try {
            const data = await getData('/api/v1/dashboard/users');

            setData(data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);

        fetchApiData();
    }, []);

    const handleDeleteClick = async (domain) => {
        const deletePromise = deleteData(
            '/api/v1/dashboard/email/blocked-emails/',
            domain
        );

        toast.promise(deletePromise, {
            loading: 'Deleting...',
            success: (result) => {
                // Check if the delete operation was successful
                if (result.success) {
                    return result.message;
                } else {
                    throw new Error(result.message);
                }
            },
            error: 'An error occurred while deleting the item.',
        });

        try {
            const result = await deletePromise;
            if (result.success) {
                await fetchApiData();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleResetToDefaultClick = async () => {
        const createDefaultPromise = createData(
            `/api/v1/dashboard/email/blocked-emails/default`,
            {}
        );

        toast.promise(createDefaultPromise, {
            loading: 'Resetting...',
            success: (result) => {
                // Check if the delete operation was successful
                if (result.success) {
                    return result.message;
                } else {
                    throw new Error(result.message);
                }
            },
            error: 'An error occurred while resetting the values.',
        });

        try {
            const result = await createDefaultPromise;
            if (result.success) {
                await fetchApiData();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleDeleteAllClick = async () => {
        const deletedPromise = deleteData(
            `/api/v1/dashboard/email/blocked-emails`,
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
                setData([]);

                await fetchApiData();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleAddNewDomainClick = async () => {
        if (inputValue.trim() === '') {
            alert('Please enter a domain name.');
            return;
        }

        const createPromise = createData(
            `/api/v1/dashboard/email/blocked-emails`,
            {
                domain: inputValue,
            }
        );

        toast.promise(createPromise, {
            loading: 'Saving...',
            success: (result) => {
                // Check if the delete operation was successful
                if (result.success) {
                    return result.message;
                } else {
                    throw new Error(result.message);
                }
            },
            error: 'An error occurred while Saving the values.',
        });

        try {
            const result = await createPromise;
            if (result.success) {
                setInputValue('');

                await fetchApiData();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return loading ? (
        <Spinner />
    ) : (
        <div className="flex flex-col gap-4">
            <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="List of blocked email domains">
                        {data &&
                            data?.map((user, index) => (
                                <CommandItem
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <p>{user?.name?.first}</p>
                                    <AiOutlineDelete
                                        className="cursor-pointer text-rose-500 text-lg"
                                        onClick={() => handleDeleteClick(user)}
                                    />
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </CommandList>
            </Command>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <Button
                        size="xs"
                        className="text-xs p-1.5 px-2"
                        onClick={handleAddNewDomainClick}
                    >
                        Add New
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        size="xs"
                        className="text-xs p-1.5 px-2"
                        onClick={handleResetToDefaultClick}
                    >
                        Reset to default
                    </Button>
                    <Button
                        variant="destructive"
                        size="xs"
                        className="text-xs p-1.5 px-2"
                        onClick={handleDeleteAllClick}
                    >
                        Delete All
                    </Button>
                </div>
            </div>
        </div>
    );
}
