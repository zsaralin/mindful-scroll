import * as React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {grey} from '@mui/material/colors';
import Slider from '@mui/material/Slider';
import {LINE_WIDTH} from "../Constants";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Box} from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: grey[500],
        },
    },
});

export default function SliderGrey(props) {
    return (
            <ThemeProvider theme={theme}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '-8px' }}>
                {props.name}
            <FormControlLabel style={{width:'30%', paddingRight: '10px', }} control={
                <Slider onChange={props.fn}
                        defaultValue={props.default} max={props.max} min={props.min}
                       aria-label="Default" size = "small" sx={{
                    '& .MuiSlider-thumb': {
                        width: '10px',
                        height: '10px',
                    }}}
                 />
            }/>
                </Box>
            </ThemeProvider>


    );

}