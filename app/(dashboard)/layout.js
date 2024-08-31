import appConfig from '@/configuration/app.config';
import NavBar from '@/components/dashboard/NavBar';
import SideBar from '@/components/dashboard/SideBar';
import { Card } from '@/components/ui/card';

export const metadata = {
    title: appConfig?.Title + ' - ' + 'Dashboard',
    description: appConfig?.Description,
};

export default function Layout({ children }) {
    return (
        <div className="w-full h-screen flex flex-col">
            <NavBar />

            <div className={`flex flex-grow overflow-hidden`}>
                <SideBar />

                <div className="p-4 w-full h-full overflow-y-auto">
                    <Card>{children}</Card>
                </div>
            </div>
        </div>
    );
}
