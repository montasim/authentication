'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const NProgressProvider = ({ children }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="2px"
                color="#f97316"
                options={{ showSpinner: false }}
                appDirectory
                shallowRouting
            />
        </>
    );
};

export default NProgressProvider;
