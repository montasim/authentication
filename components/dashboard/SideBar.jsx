import React from 'react';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MdBarChart, MdSpaceDashboard } from 'react-icons/md';
import { PiDeviceTabletFill, PiUsersThreeFill } from 'react-icons/pi';
import { IoLinkSharp } from 'react-icons/io5';
import {
    RiLockPasswordFill,
    RiMailCloseFill,
    RiMailForbidFill,
} from 'react-icons/ri';
import { TbBracketsContain, TbGridPattern } from 'react-icons/tb';
import { FaCloudUploadAlt, FaImage, FaUsers } from 'react-icons/fa';
import { GrMultimedia } from 'react-icons/gr';

export default function SideBar() {
    return (
        <aside className="h-full">
            <Card className="flex flex-col justify-between w-60 h-full p-4">
                <div className="">
                    <Link href="/dashboard">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <MdSpaceDashboard />
                            </span>

                            <span className="">Dashboard</span>
                        </p>
                    </Link>

                    <Link href="/constants">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <TbBracketsContain />
                            </span>

                            <span className="">Constants</span>
                        </p>
                    </Link>

                    <Link href="/patterns">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <TbGridPattern />
                            </span>

                            <span className="">Patterns</span>
                        </p>
                    </Link>

                    <Link href="/default/gender-images">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <FaImage />
                            </span>

                            <span className="">Default Gender Image</span>
                        </p>
                    </Link>

                    <Link href="/default/urls">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <IoLinkSharp />
                            </span>

                            <span className="">Default URLs</span>
                        </p>
                    </Link>

                    <Link href="/environments">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <PiDeviceTabletFill />
                            </span>

                            <span className="">Environments</span>
                        </p>
                    </Link>

                    <Link href="/content-types">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <GrMultimedia />
                            </span>

                            <span className="">Content Types</span>
                        </p>
                    </Link>

                    <Link href="/activity-types">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <MdBarChart />
                            </span>

                            <span className="">Activity Types</span>
                        </p>
                    </Link>

                    <Link href="/email/temporary-emails">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <RiMailCloseFill />
                            </span>

                            <span className="">Temporary Emails</span>
                        </p>
                    </Link>

                    <Link href="/email/blocked-emails">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <RiMailForbidFill />
                            </span>

                            <span className="">Blocked Emails</span>
                        </p>
                    </Link>

                    <Link href="/common-passwords">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <RiLockPasswordFill />
                            </span>

                            <span className="">Common Passwords</span>
                        </p>
                    </Link>

                    <Link href="/upload">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <FaCloudUploadAlt />
                            </span>

                            <span className="">Upload</span>
                        </p>
                    </Link>

                    <Link href="/users">
                        <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                            <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                                <PiUsersThreeFill />
                            </span>

                            <span className="">Users</span>
                        </p>
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage
                            src="https://avatars.githubusercontent.com/u/95298623?v=4"
                            alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <strong className="font-roboto font-semibold">Admin</strong>
                </div>
            </Card>
        </aside>
    );
}
