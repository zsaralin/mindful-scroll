import * as React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {grey} from '@mui/material/colors';
import Slider from '@mui/material/Slider';
import {LINE_WIDTH} from "../Constants";
import FormControlLabel from "@mui/material/FormControlLabel";

const theme = createTheme({
    palette: {
        primary: {
            main: grey[500],
        },
    },
});

export default function SliderGrey(props) {
    return (
        <div id="controlPanelRow">{props.name}
            <FormControlLabel style={{width:'50%', paddingRight: '10px'}} control={
            <ThemeProvider theme={theme}>
                <Slider onChange={props.fn}
                        defaultValue={props.default} max={props.max} min={props.min}
                        color="primary" aria-label="Default"/>
            </ThemeProvider>}/></div>


    );
}