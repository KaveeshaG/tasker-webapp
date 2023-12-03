import React from 'react';
import { ServerIcon } from '@heroicons/react/outline';

function SideBar() {
    return (
        <div className="fixed inset-y-0 left-0 bg-white w-40">
            <h1 className="flex items-center justify-center text-2xl
            h-16 bg-black text-white font-bold">Tasker!.</h1>

            <ul className="flex flex-col text-lg h-full">
                <li className="flex justify-center items-center flex-col
                py-7 border-l-4 border-black text-black
                font-bold">
                    <ServerIcon className="w-7 h-7 text-black"/>
                    Boards
                </li>
            </ul>
        </div>
    );
}

export default SideBar;