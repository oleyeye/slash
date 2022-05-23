import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from "@mui/material";
import { Grid, TextField, Typography, Button, Input } from '@mui/material';
import "./index.css";

const TITLE_COL = 2;
const HALF_COL = 6 - TITLE_COL;
const FULL_COL = 12 - TITLE_COL;

const DEFAULT_FORM_VAlUE = {
    id: '',
    name: '',
    title: '',
    sites: [],
    searchPath: ''
};

const DEFAULT_ERROR_STATE = {
    id: false,
    name: false,
    title: false,
    sites: false,
    searchPath: false
};

export default function DataItem(props) {
    const { title, open, onClose, onSave, onError } = props;
    const [formValues, setFormValues] = useState(DEFAULT_FORM_VAlUE);
    const [errorState, setErrorState] = useState(DEFAULT_ERROR_STATE);

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === 'sites') {
            value = value.split(/\n/)
        }

        const newValues = {
            ...formValues,
            [name]: value
        }

        if (name === 'name') {
            newValues['id'] = `slash.${value}`;
        }

        setFormValues(newValues);
    }

    const handleSave = () => {
        const data = {
            ...formValues,
            sites: formValues.sites.filter(e => !!e),
        }

        const newErrorState = { ...errorState };
        let hasError = false
        for (let [key, value] of Object.entries(data)) {
            if ((key === 'sites' && value.length === 0) || !value) {
                newErrorState[key] = true;
                hasError = true;
            }
        }

        setErrorState(newErrorState);
        if (hasError) {
            return;
        }

        try {
            onSave(data);
            onClose();
        } catch (e) {
            onError(e.message, 'error');
        }
    }

    const handleClose = (e, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        onClose();
    }

    useEffect(() => {
        setFormValues(DEFAULT_FORM_VAlUE);
        setErrorState(DEFAULT_ERROR_STATE);
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth={true}>
            <DialogTitle sx={{ m: '0 auto' }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please populate name, title, sites and search path to define a slash item.
                </DialogContentText>
                <Grid container
                    noValidate
                    autoComplete="off"
                    component="form">
                    <Grid item className="new-item-title" xs={TITLE_COL}>
                        <Typography>Name:</Typography>
                    </Grid>
                    <Grid item xs={HALF_COL}>
                        <TextField autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            size="small"
                            fullWidth
                            variant="outlined"
                            value={formValues.name}
                            onChange={handleInputChange}
                            error={errorState.name} />
                        <Input type="hidden" value={formValues.id}></Input>
                    </Grid>
                    <Grid item xs={12 - TITLE_COL - HALF_COL}></Grid>
                    <Grid item className="new-item-title" xs={TITLE_COL}>
                        <Typography>Title:</Typography>
                    </Grid>
                    <Grid item xs={HALF_COL}>
                        <TextField autoFocus
                            required
                            margin="dense"
                            id="title"
                            name="title"
                            size="small"
                            fullWidth
                            variant="outlined"
                            value={formValues.title}
                            onChange={handleInputChange}
                            error={errorState.title} />
                    </Grid>
                    <Grid item xs={12 - TITLE_COL - HALF_COL}></Grid>
                    <Grid item className="new-item-title" xs={TITLE_COL}>
                        <Typography>Sites:</Typography>
                    </Grid>
                    <Grid item xs={FULL_COL}>
                        <TextField autoFocus
                            required
                            margin="dense"
                            id="sites"
                            name="sites"
                            fullWidth
                            multiline
                            size="small"
                            variant="outlined"
                            placeholder="One line for each site"
                            value={formValues.sites.join('\n')}
                            onChange={handleInputChange}
                            error={errorState.sites} />
                    </Grid>
                    <Grid item className="new-item-title" xs={TITLE_COL}>
                        <Typography>Search Path:</Typography>
                    </Grid>
                    <Grid item xs={FULL_COL}>
                        <TextField autoFocus
                            required
                            margin="dense"
                            id="searchPath"
                            name="searchPath"
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder='Use {0} as placeholder for search keywords'
                            value={formValues.searchPath}
                            onChange={handleInputChange}
                            error={errorState.searchPath} />
                    </Grid>
                </Grid>
            </DialogContent >
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Ok</Button>
            </DialogActions>
        </Dialog >
    );
}