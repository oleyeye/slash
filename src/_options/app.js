import 'normalize.css';
import { useState, useEffect } from 'react';
import { StyledEngineProvider } from '@mui/styled-engine';
import { Alert, Box, Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import AppBanner from './appBanner';
import DataView from './dataView';
import DataItem from './dataItem';

function Option() {
    const [rows, setRows] = useState([]);
    const [alert, setAlert] = useState({ message: '', type: 'info' });
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isNewViewOpen, setIsNewViewOpen] = useState(false);
    const [updated, setUpdated] = useState(false);

    const handleAdd = (item) => {
        if (rows.findIndex(e => e.id === item.id) >= 0) {
            throw new Error('An item with same name already exists');
        }
        const newRows = [...rows, item];
        setRows(newRows);
        setUpdated(true);
    }

    const handleDelete = (id) => {
        const newRows = rows.filter(item => item.id !== id);
        setRows(newRows);
        setUpdated(true);
    }

    const handleSave = () => {
        chrome.storage.sync.set({ options: rows }, () => {
            console.log('Saved');
            setRows(rows);
            setUpdated(false);
            openAlert("Saved")
        });
    }

    const handleClose = () => {
        setUpdated(false);
        window.close();
    }

    const openAlert = (message, type = 'info') => {
        setAlert({ message: message, type: type });
        setIsAlertOpen(true);
    }

    const closeAlert = () => {
        setAlert({message: '', type: 'info'});
        setIsAlertOpen(false);
    }

    const openNewView = () => {
        setIsNewViewOpen(true);
    }

    const closeNewView = () => {
        setIsNewViewOpen(false);
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
            <Box sx={{ mt: 1, p: 1 }}>
                <Button variant='contained'
                    size="small"
                    sx={{ mr: 1, width: 100 }}
                    onClick={openNewView}>Add</Button>
                <Button variant='contained'
                    size="small"
                    sx={{ mr: 1, width: 100 }}
                    disabled={!updated}
                    onClick={handleSave}>Save</Button>
                <Button variant='outlined'
                    size="small"
                    sx={{ mr: 1, width: 100 }}
                    onClick={handleClose}>Close</Button>
            </Box>
            <DataItem title="Create New Item"
                open={isNewViewOpen}
                onClose={closeNewView}
                onSave={handleAdd}
                onError={openAlert} />
            <Snackbar open={isAlertOpen}
                autoHideDuration={6000}
                onClose={closeAlert}
            >
                <Alert severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default function App() {
    return (
        <StyledEngineProvider injectFirst>
            <Option />
        </StyledEngineProvider>
    );
}