import {createTheme, FormControl, FormHelperText, MenuItem, NativeSelect, Select} from "@mui/material";
import {changeColourSpeed} from "../Stroke/Color/StrokeColor";
import {setFillType} from "../Tile/CompleteTile";
import {SelectChangeEvent} from "@mui/material";
import * as React from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {setDotType} from "../Stroke/Dot/DotType";
import {setStrokeType} from "../Stroke/StrokeType";

const theme = createTheme({
    typography: {
        fontFamily: [
            'Montserrat',
            'sans-serif'
        ].join(','),
        fontSize: 11,
    }
});

export function FillStyle(props) {

    const handleChange = (event: SelectChangeEvent) => {
        setFillType(event.target.value.toString());
    };

    return (
        <ThemeProvider theme={theme}>
        <div id="controlPanelRow">{props.name}
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <NativeSelect
                defaultValue="combination"
                onChange={handleChange}
                inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                }}
            >
                <option value={"first"} >First</option>
                <option value={"last"}>Last</option>
                <option value={"complem"}>Complementary Colour</option>
                <option value={"combination"}>Combination</option>
                <option value={"blurFill"}>Blur/Fill</option>
                <option value={"blur"}>Blur/No Fill</option>
                <option value={"meanHue"}>Mean Hue</option>
                <option value={"inverseMean"}>Inverse Mean Hue</option>
                <option value={"radialGradient"}>Radial Gradient</option>
                <option value={"diagGradient"}>Diagonal Gradient</option>
                <option value={"horizGradient"}>Horizontal Gradient</option>
                <option value={"vertGradient"}>Vertical Gradient</option>
                <option value={"dither1"}>Dither 1</option>
                <option value={"dither2"}>Dither 2</option>
                <option value={"dither3"}>Dither 3</option>
                <option value={"dither4"}>Dither 4</option>
                <option value={"dither5"}>Dither 5</option>
                <option value={"mostUsed"}>Most Used Colour</option>
                <option value={"leastUsed"}>Least Used Colour</option>
                <option value={"inverseComb"}>Inverse Combination</option>
                <option value={"pattern"}>Pattern</option>
                <option value={"stripesH"}>Horizontal Stripes</option>
                <option value={"stripesV"}>Vertical Stripes</option>
                <option value={"fillAnim"} >Fill Animation</option>
            </NativeSelect>
        </FormControl>
            </div>
        </ThemeProvider>
    );
}


export function DotStyle(props) {

    const handleChange = (event: SelectChangeEvent) => {
        setDotType(event.target.value.toString());
    };

    return (
        <ThemeProvider theme={theme}>
            <div id="controlPanelRow">{props.name}
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <NativeSelect
                        defaultValue="combination"
                        onChange={handleChange}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                    >
                        <option value={"reg"} >Regular</option>
                        <option value={"clover"}>Clover</option>
                        <option value={"flower"}>Flower</option>
                        <option value={"grad-pulse"}>Gradient Pulse</option>
                        <option value={"pulse"}>Pulse</option>
                        <option value={"transparent"}>Transparent</option>
                    </NativeSelect>
                </FormControl>
            </div>
        </ThemeProvider>
    );
}

export function StrokeStyle(props) {

    const handleChange = (event: SelectChangeEvent) => {
        setStrokeType(event.target.value.toString());
    };

    return (
        <ThemeProvider theme={theme}>
            <div id="controlPanelRow">{props.name}
                <FormControl sx={{ m: 1, minWidth: 120}}>
                    <NativeSelect
                        defaultValue="combination"
                        onChange={handleChange}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                    >
                        <option value={"reg"} >Regular</option>
                        <option value={"fuzzy"}>Fuzzy</option>
                        <option value={"transparent"}>Transparent</option>
                        <option value={"dotted"}>Dotted</option>

                    </NativeSelect>
                </FormControl>
            </div>
        </ThemeProvider>
    );
}