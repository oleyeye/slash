import 'normalize.css';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBanner from './appBanner';
import DataView from './dataView';

export default function App() {
    const [rows, setRows] = useState([]);

    const handleAdd = (item) => {
        const newRows = rows.push(item);
        setRows(newRows);
    }

    const handleDelete = (id) => {
        const newRows = rows.filter(item => item.id !== id);
        setRows(newRows);
    }

    const handleSave = () => {
        chrome.storage.sync.set({ options: rows }, () => {
            console.log('Saved');
            setRows(rows);
        });
    }

    useEffect(() => {
        chrome.storage.sync.get("options", ({ options }) => {
            setRows(options);
        });
    }, [])

    return (
        <>
            <AppBanner />
            <Box>
                <DataView title="Slash Items" rows={rows} onDelete={handleDelete} />
            </Box>
        </>
    );
}