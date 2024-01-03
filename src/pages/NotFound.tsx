import { Box, Typography } from '@mui/material';
import '../assets/not-found.css';
import { memo } from "react";

const NotFound = memo(() => {
    return (
        <Box>
            <Typography variant="h1" component="h2">
                404
            </Typography>
            <Typography variant="h4" component="h2">
                Page not Found
            </Typography>
            <div className='nf-container'>
                <h1>404</h1>                    
                <h4>Page not Found</h4>       
            </div>     
        </Box>
    );
});

export default NotFound;