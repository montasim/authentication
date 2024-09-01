import React from 'react';
import Link from 'next/link';

import { HiOutlineHome } from 'react-icons/hi';
import { Card } from '@/components/ui/card';
import { MdEmail, MdPassword, MdSpaceDashboard } from 'react-icons/md';
import { LuActivitySquare } from 'react-icons/lu';
import { PiDeviceTabletFill } from 'react-icons/pi';
import { IoLinkSharp } from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';

export default function SideBar() {
    return (
        <aside className="h-full">
            <Card className="w-60 h-full p-4">
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
                            <HiOutlineHome />
                        </span>

                        <span className="">Constants</span>
                    </p>
                </Link>

                <Link href="/patterns">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <HiOutlineHome />
                        </span>

                        <span className="">Patterns</span>
                    </p>
                </Link>

                <Link href="/default/gender-images">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <IoMdSettings />
                        </span>

                        <span className="">Default Gender Image</span>
                    </p>
                </Link>

                <Link href="/manage-urls">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <IoLinkSharp />
                        </span>

                        <span className="">Manage URLs</span>
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
                            <HiOutlineHome />
                        </span>

                        <span className="">Content Types</span>
                    </p>
                </Link>

                <Link href="/activity-types">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <LuActivitySquare />
                        </span>

                        <span className="">Activity Types</span>
                    </p>
                </Link>

                <Link href="/temporary-emails">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <MdEmail />
                        </span>

                        <span className="">Temporary Emails</span>
                    </p>
                </Link>

                <Link href="/blocked-emails">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <MdEmail />
                        </span>

                        <span className="">Blocked Emails</span>
                    </p>
                </Link>

                <Link href="/common-passwords">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <MdPassword />
                        </span>

                        <span className="">Common Passwords</span>
                    </p>
                </Link>
            </Card>
        </aside>
    );
}
