import 'normalize.css';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBanner from './appBanner';
import DataView from './dataView';

export default function App() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        chrome.storage.sync.get("options", ({ options }) => {
            setRows(Object.values(options));
        });
    }, [])

    return (
        <>
            <AppBanner />
            <Box>
                <DataView title="Slash Items" rows={rows} />
            </Box>
        </>
    );
}