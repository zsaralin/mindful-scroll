import * as React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {grey} from '@mui/material/colors';
import Slider from '@mui/material/Slider';
import {LINE_WIDTH} from "../Constants";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Box, Checkbox, FormControl, FormLabel, Radio, RadioGroup, Typography} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";

const theme = createTheme({
    typography: {
        // In Chinese and Japanese the characters are usually larger,
        // so a smaller fontsize may be appropriate.
        fontSize: 12,
        fontFamily: 'Montserrat'
    },
    palette: {
        primary: {
            main: grey[500],
        },
    },
});

export default function CheckboxGrey(props) {
    return (
        <div id="controlPanelRow">{props.name}
            <ThemeProvider theme={theme}>
            <RadioGroup defaultValue="Combination" style={{display: 'flex', flexDirection: 'row'}}>
                <FormControlLabel control={<Radio/>} label="Combination"
                                  sx={{'& .MuiSvgIcon-root': {fontSize: 15}}}
                                  onChange={props.fn} value="Combination"
                />
                <FormControlLabel  control={<Radio/>} label="First"
                                  sx={{'& .MuiSvgIcon-root': {fontSize: 15}}}
                                  onChange={props.fn} value="First"
                />
                <FormControlLabel  control={<Radio/>} label="Last"
                                  sx={{'& .MuiSvgIcon-root': {fontSize: 15}}}
                                  onChange={props.fn} value="Last"
                />
            </RadioGroup>
            </ThemeProvider>
        </div>
    );

}