import { Box, Typography } from '@mui/material';
import { memo } from "react";

const NotFound = memo(() => {
    return (
        <Box             
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100%',
                //backgroundColor: '#e8e8e8'                                            
            }}
        >
            <Typography                 
                sx={{ 
                    fontWeight: 600,
                    fontSize: '7rem',
                    lineHeight: '6.5rem'
                }}
            >
                404
            </Typography>
            <Typography 
                sx={{ 
                    fontWeight: 600,
                    fontSize: '2rem'
                }}
            >
                Page not Found
            </Typography>            
        </Box>
    );
});

export default NotFound;