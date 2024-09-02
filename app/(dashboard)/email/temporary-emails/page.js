'use client';

import React, { useState, useEffect } from 'react';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';
import { createData, deleteData, getData } from '@/utilities/axios';
import Spinner from '@/components/spinner/Spinner';
import { AiOutlineDelete } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TemporaryEmailDomainsEditor() {
    const [temporaryEmailDomains, setTemporaryEmailDomains] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchApiData = async () => {
        setLoading(true);
        try {
            const data = await getData(
                '/api/v1/dashboard/email/temporary-emails'
            );
            setTemporaryEmailDomains(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApiData();
    }, []);

    const handleDeleteClick = async (domain) => {
        console.log('domain', domain);
        await deleteData(`/api/v1/dashboard/email/temporary-emails/`, domain);
        await fetchApiData();
    };

    const handleResetToDefaultClick = async () => {
        await createData(
            `/api/v1/dashboard/email/temporary-emails/default`,
            {}
        );
        await fetchApiData();
    };

    const handleDeleteAllClick = async () => {
        await deleteData(`/api/v1/dashboard/email/temporary-emails`, '');
        setTemporaryEmailDomains([]);
    };

    const handleAddNewDomainClick = async () => {
        if (inputValue.trim() === '') {
            alert('Please enter a domain name.');
            return;
        }

        await createData(`/api/v1/dashboard/email/temporary-emails`, {
            domain: inputValue,
        });
        setInputValue('');
        await fetchApiData();
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
                    <CommandGroup heading="temporary email domains">
                        {temporaryEmailDomains.map((domain, index) => (
                            <CommandItem
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <p>{domain}</p>
                                <AiOutlineDelete
                                    className="cursor-pointer text-destructive"
                                    onClick={() => handleDeleteClick(domain)}
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
