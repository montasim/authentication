import React from 'react';
import Link from 'next/link';
import { HiOutlineHome } from 'react-icons/hi';
import { Card } from '@/components/ui/card';

export default function SideBar() {
    return (
        <aside className="h-full py-4">
            <Card className="w-60 h-full p-4">
                <Link href="#">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <HiOutlineHome />
                        </span>

                        <span className="">Dashboard</span>
                    </p>
                </Link>

                <Link href="/writers">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <HiOutlineHome />
                        </span>

                        <span className="">লেখক</span>
                    </p>
                </Link>

                <Link href="/subjects">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <HiOutlineHome />
                        </span>

                        <span className="">বিষয়</span>
                    </p>
                </Link>

                <Link href="/publications">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <HiOutlineHome />
                        </span>

                        <span className="">প্রকাশনী</span>
                    </p>
                </Link>

                <Link href="/ebooks">
                    <p className="group flex space-x-2 items-center text-muted-foreground transition-colors hover:text-foreground">
                        <span className="hover:bg-primary hover:text-secondary w-8 h-8 flex items-center justify-center rounded-lg">
                            <HiOutlineHome />
                        </span>

                        <span className="">ই-বুক</span>
                    </p>
                </Link>
            </Card>
        </aside>
    );
}
