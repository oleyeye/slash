import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import AdbIcon from '@mui/icons-material/Adb';
import Logo from '../images/lightning.svg';

export default function AppBanner() {
    return (
        <AppBar position="static">
            <Box maxWidth="xl" sx={{ flexGrow: 1, padding: '0 20px' }}>
                <Toolbar disableGutters>
                    <Logo width={24} height={24} sx={{ mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                        Slash
                    </Typography>
                </Toolbar>
            </Box>
        </AppBar>
    );
}