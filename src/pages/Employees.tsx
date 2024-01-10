import { Box, Card, CardContent, Typography } from "@mui/material";
import { memo } from "react";

const Employees = memo(() => {
    return (
        <Box 
            sx={{
                padding: 1
            }}
        >
            <Card 
                variant="soft"
                sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Word of the Day
                    </Typography>                    
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        adjective
                    </Typography>
                    <Typography variant="body2">
                        well meaning and kindly.
                        <br />
                        {'"a benevolent smile"'}
                    </Typography>
                </CardContent>      
            </Card>
        </Box>
    );
});

export default Employees;