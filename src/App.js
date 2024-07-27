import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home';
import Practice from './Practice';
import Game from './Game'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/practice",
        element: <Practice />
    }
]);

export default function App() {
    return (
        <RouterProvider router={router} />
    );
};