import {gsap} from "gsap";
import FormGroup from "@mui/material/FormGroup";
import SwitchGrey from "./SwitchGrey";
import {triggerAudio} from "../Audio/Audio";
import {setfillType, triggerCompleteTile} from "../Tile/CompleteTile";
import SliderGrey from "./SliderGrey";
import {changeLineWidth} from "../Stroke/StrokeWidth";
import {FILL_RATIO, LINE_WIDTH, TILE_WIDTH} from "../Constants";
import {changeColourSpeed, colorDelay, stopColorChange, triggerRandomColour} from "../Stroke/Color/StrokeColor";
import {changeTileWidth} from "../Tiling/TileWidth";
import {triggerShrinkStroke} from "../Stroke/StrokeType/ShrinkingStroke";
import {changeFillMin} from "../Tile/FillTile/FillRatio";
import {isSlowScrollOn, triggerSlowScroll} from "../Scroll/SlowScroll";
import {changeTilingSize} from "../Tiling/TilingSize";
import {Handedness} from "./CheckboxGrey";
import {DotStyle, Dropdown, FillStyle, StrokeStyle, TilingPath} from "./Dropdown"
import {SwitchGreyUnchecked, SwitchGreyChecked} from "./SwitchGrey";
import {triggerScroll} from "../Scroll/AutoScroll";
import {FormControl, FormHelperText, MenuItem, Select} from "@mui/material";

let panelOn = false;

export function hideControlPanel() {
    const controlPanelBackground = document.getElementById("controlPanelBackground");
    controlPanelBackground.style.visibility  = 'hidden'
    gsap.to("#controlPanel", {left: -window.innerWidth + 'px', duration: 1, delay: 0})
    panelOn = false;
    // colorDelay()
}

export function showControlPanel() {
    const controlPanelBackground = document.getElementById("controlPanelBackground");
    controlPanelBackground.style.visibility  = 'visible'
    gsap.to("#controlPanel", {left: 0 + 'px', duration: 1, delay: 0})
    panelOn = true;
}

export function isPanelOn(){
    return panelOn;
}

export default function ControlPanel() {
    return (
        <div >
            <div id="controlPanel">
                <div style={{padding: '20px', fontSize: '.9em'}}>Control Panel</div>
                <FormGroup style={{paddingLeft: '25px', fontSize: '.8em', fontFamily : 'montserrat'}}>
                    <SwitchGreyChecked name="Music" fn={triggerAudio} />
                    <SwitchGreyChecked name="Show Feedback" fn={triggerAudio} />
                    <SwitchGreyChecked name="Show Colour Preview" fn={triggerAudio} />
                    <SwitchGreyChecked name="Auto Page Scroll" fn={triggerScroll}/>
                    <SwitchGreyChecked name="Auto Complete Tile" fn={triggerCompleteTile} />
                    <SwitchGreyUnchecked name="Auto Stroke Width" fn={triggerShrinkStroke} />
                    <SwitchGreyChecked name="Random Colour Change" fn={triggerRandomColour} />
                    <SwitchGreyUnchecked name="Slow Page Scroll" fn={triggerSlowScroll} />
                    {/*<div style = {{paddingBottom:'8px'}}></div>*/}
                    <SliderGrey name="Stroke Width" fn={changeLineWidth} default = {LINE_WIDTH} min = {5} max = {40}/>
                    <SliderGrey name="Tile Outline Width" fn={changeTileWidth} default = {TILE_WIDTH} min = {5} max = {40}/>
                    <SliderGrey name="Colour Change" fn={changeColourSpeed} default = {-300} min = {-1000} max = {-100}/>
                    <SliderGrey name="Auto Fill Percentage" fn={changeFillMin} default = {FILL_RATIO*100} min = {0} max = {95}/>
                    <SliderGrey name="Tiling Size" fn={changeTilingSize} default = {-50} min = {-window.innerWidth/3} max = {-50}/>
                    {/*<div style = {{paddingBottom:'8px'}}></div>*/}
                    <FillStyle name = "Fill Style"/>
                    <StrokeStyle name = "Stroke Style"/>
                    <DotStyle name = "Dot Style"/>
                    <TilingPath name = "Tiling Path"/>
                    <Handedness name = "Handedness"/>
                </FormGroup>
            </div>
            <div id="controlPanelBackground" onClick={hideControlPanel}></div>
        </div>
    )
}