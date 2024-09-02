import React from 'react';

import { Card } from '@/components/ui/card';

import { ColorToggle } from '@/components/theme/ColorToggle';
import { ModeToggle } from '@/components/theme/ModeToggle';

export default function NavBar() {
    return (
        <Card className="flex items-center justify-between p-2 bg-card text-card-foreground border-b border-x-0 border-t-0 rounded-none space-x-4">
            <div className="flex items-center justify-between space-x-4">
                <img
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="size-10 rounded-lg object-cover"
                />

                {/*<strong className="font-roboto uppercase font-semibold">*/}
                {/*    Library Management System*/}
                {/*</strong>*/}
            </div>

            <div className="flex items-center justify-between space-x-4">
                <ColorToggle />

                <ModeToggle />
            </div>
        </Card>
    );
}
