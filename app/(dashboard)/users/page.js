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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Spinner from '@/components/spinner/Spinner';
import { AiOutlineDelete } from 'react-icons/ai';
import {
    MdRemoveRedEye,
    MdUpdate,
    MdVerified,
    MdVisibility,
    MdVisibilityOff,
} from 'react-icons/md';
import { HiXCircle } from 'react-icons/hi';
import { BiLogoPinterest } from 'react-icons/bi';
import { deleteData, getData, updateData } from '@/utilities/axios';
import { FaRegCalendarAlt } from 'react-icons/fa';

export default function BlockedEmailDomainsEditor() {
    const [data, setData] = useState([]);
    const [userDetails, setUserDetails] = useState({});
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

    const handleUserDetailsClick = async (id, siteName) => {
        const getUserPromise = getData(
            `/api/v1/dashboard/users?id=${id}&siteName=${siteName}`,
            ''
        );

        toast.promise(getUserPromise, {
            loading: 'Fetching...',
            success: (result) => {
                // Check if the delete operation was successful
                if (result.success) {
                    return result.message;
                } else {
                    throw new Error(result.message);
                }
            },
            error: 'An error occurred while fetching the item.',
        });

        try {
            const result = await getUserPromise;
            if (result.success) {
                setUserDetails(result.data);
                await fetchApiData();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return loading ? (
        <Spinner />
    ) : (
        <div className="flex flex-col gap-4">
            <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    {data && data.length > 0 ? (
                        <CommandGroup heading="List of blocked email domains">
                            {data.map((siteData) => (
                                <React.Fragment key={siteData + siteData}>
                                    <p className="text-lg">
                                        {siteData?.site} -{' '}
                                        {siteData?.data?.length}
                                    </p>
                                    {siteData?.data?.map((item) => (
                                        <CommandItem
                                            key={item?._id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="max-w-10">
                                                {item?.isVerified ? (
                                                    <MdVerified className="text-green-500 text-lg" />
                                                ) : (
                                                    <HiXCircle className="text-rose-500 text-lg" />
                                                )}
                                            </div>
                                            <Avatar>
                                                <AvatarImage
                                                    src={
                                                        item?.image
                                                            ?.downloadLink
                                                    }
                                                    alt={`${item?.name?.first} image`}
                                                />
                                                <AvatarFallback>{`${item?.name?.first} image`}</AvatarFallback>
                                            </Avatar>
                                            <p>{item?.name?.first}</p>
                                            <Select>
                                                <SelectTrigger className="max-w-[250px]">
                                                    <SelectValue
                                                        placeholder={
                                                            item?.emails?.length
                                                                ? 'Emails'
                                                                : 'Email not set'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {item?.emails?.map(
                                                        (email) => (
                                                            <SelectItem
                                                                key={
                                                                    email?.email
                                                                }
                                                                value="light"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <p>
                                                                        {email
                                                                            ?.email
                                                                            ?.isEmailVerified ? (
                                                                            <MdVerified className="text-green-500 text-lg" />
                                                                        ) : (
                                                                            <HiXCircle className="text-rose-500 text-lg" />
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        {
                                                                            email?.email
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {email
                                                                            ?.email
                                                                            ?.isPrimaryEmail && (
                                                                            <BiLogoPinterest />
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Select>
                                                <SelectTrigger className="max-w-[250px]">
                                                    <SelectValue
                                                        placeholder={
                                                            item?.mobiles
                                                                ?.length
                                                                ? 'Mobiles'
                                                                : 'Mobile not set'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {item?.mobiles?.map(
                                                        (mobile) => (
                                                            <SelectItem
                                                                key={
                                                                    mobile?.email
                                                                }
                                                                value="light"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <p>
                                                                        {mobile?.isMobileVerified ? (
                                                                            <MdVerified className="text-green-500 text-lg" />
                                                                        ) : (
                                                                            <HiXCircle className="text-rose-500 text-lg" />
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        {
                                                                            mobile?.email
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {mobile
                                                                            ?.email
                                                                            ?.isPrimaryMobile && (
                                                                            <BiLogoPinterest />
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Select>
                                                <SelectTrigger className="max-w-[140px]">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                {/*TODO: create a status array (active. deleted, disabled, restricted)*/}
                                                <SelectContent>
                                                    <SelectItem value="active">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="inactive">
                                                        Inactive
                                                    </SelectItem>
                                                    <SelectItem value="restricted">
                                                        Restricted
                                                    </SelectItem>
                                                    <SelectItem value="deleted">
                                                        Deleted
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Dialog>
                                                <DialogTrigger>
                                                    <MdRemoveRedEye
                                                        className="cursor-pointer text-violet-500 text-lg"
                                                        onClick={() =>
                                                            handleUserDetailsClick(
                                                                item?._id,
                                                                siteData?.site
                                                            )
                                                        }
                                                    />
                                                </DialogTrigger>
                                                {userDetails && (
                                                    <UserDetailsCard
                                                        data={userDetails}
                                                        handleUserDetailsClick={
                                                            handleUserDetailsClick
                                                        }
                                                    />
                                                )}
                                            </Dialog>
                                            <AiOutlineDelete
                                                className="cursor-pointer text-rose-500 text-lg"
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        siteData?.site,
                                                        item?._id
                                                    )
                                                }
                                            />
                                        </CommandItem>
                                    ))}
                                </React.Fragment>
                            ))}
                        </CommandGroup>
                    ) : (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}
                </CommandList>
            </Command>
        </div>
    );
}

const UserDetailsCard = ({ data, handleUserDetailsClick }) => {
    const handleSaveUserData = async (event, id) => {
        event.preventDefault();

        const status = event.target.status.value;

        const updateUserPromise = updateData(
            `/api/v1/dashboard/users/${data?.id}`,
            (data.status = status)
        );

        toast.promise(updateUserPromise, {
            loading: 'Updating...',
            success: (result) => {
                // Check if the delete operation was successful
                if (result.success) {
                    return result.message;
                } else {
                    throw new Error(result.message);
                }
            },
            error: 'An error occurred while updating the user.',
        });

        try {
            const result = await updateUserPromise;
            if (result.success) {
                await handleUserDetailsClick(id, data?.siteName);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <DialogContent className="sm:max-w-[825px]">
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                    Make changes here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <form
                onSubmit={(event) => handleSaveUserData(event, data?._id)}
                className="grid gap-4 py-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        {data?.isVerified ? (
                            <MdVerified className="text-green-500 text-lg" />
                        ) : (
                            <HiXCircle className="text-rose-500 text-lg" />
                        )}

                        {data?.privacySettings?.profileVisibility ? (
                            <MdVisibility className="text-green-500 text-lg" />
                        ) : (
                            <MdVisibilityOff className="text-rose-500 text-lg" />
                        )}
                    </div>
                    <Badge
                        className="flex items-center gap-3"
                        variant="outline"
                    >
                        <FaRegCalendarAlt />
                        {data?.createdAt}
                    </Badge>
                    <Badge
                        className="flex items-center gap-3"
                        variant="outline"
                    >
                        <MdUpdate />
                        {data?.createdAt}
                    </Badge>
                    <Select name="status">
                        <SelectTrigger className="max-w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        {/*TODO: create a status array (active. deleted, disabled, restricted)*/}
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="restricted">
                                Restricted
                            </SelectItem>
                            <SelectItem value="deleted">Deleted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-3">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">First Name</Label>
                        <Input
                            type="text"
                            id="firstName"
                            value={data?.name?.first}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Middle Name</Label>
                        <Input
                            type="text"
                            id="middleName"
                            value={data?.name?.middle}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Last Name</Label>
                        <Input
                            type="text"
                            id="middleName"
                            value={data?.name?.last}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Username</Label>
                        <Input
                            type="text"
                            id="firstName"
                            value={data?.username}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Emails</Label>
                        <Select>
                            <SelectTrigger className="max-w-[250px]">
                                <SelectValue
                                    placeholder={
                                        data?.emails?.length
                                            ? 'Emails'
                                            : 'Email not set'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {data?.emails?.map((email) => (
                                    <SelectItem
                                        key={email?.email}
                                        value="light"
                                    >
                                        <div className="flex items-center gap-2">
                                            <p>
                                                {email?.isMobileVerified ? (
                                                    <MdVerified className="text-green-500 text-lg" />
                                                ) : (
                                                    <HiXCircle className="text-rose-500 text-lg" />
                                                )}
                                            </p>
                                            <p>{email?.email}</p>
                                            <p>
                                                {email?.email
                                                    ?.isPrimaryMobile && (
                                                    <BiLogoPinterest />
                                                )}
                                            </p>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Mobiles</Label>
                        <Select>
                            <SelectTrigger className="max-w-[250px]">
                                <SelectValue
                                    placeholder={
                                        data?.mobiles?.length
                                            ? 'Mobiles'
                                            : 'Mobile not set'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {data?.mobiles?.map((mobile) => (
                                    <SelectItem
                                        key={mobile?.mobile}
                                        value="light"
                                    >
                                        <div className="flex items-center gap-2">
                                            <p>
                                                {mobile?.isMobileVerified ? (
                                                    <MdVerified className="text-green-500 text-lg" />
                                                ) : (
                                                    <HiXCircle className="text-rose-500 text-lg" />
                                                )}
                                            </p>
                                            <p>{mobile?.mobile}</p>
                                            <p>
                                                {mobile?.mobile
                                                    ?.isPrimaryMobile && (
                                                    <BiLogoPinterest />
                                                )}
                                            </p>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        size="xs"
                        type="submit"
                        className="text-xs p-1.5 px-2"
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};
