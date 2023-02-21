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
            <ThemeProvider theme={theme}>

            <FormControlLabel style={{width:'30%', paddingRight: '10px'}} control={
                <Slider onChange={props.fn}
                        defaultValue={props.default} max={props.max} min={props.min}
                       aria-label="Default" size = "small"/>
            }/>
            </ThemeProvider></div>


    );

}