import {gsap} from "gsap";
import FormGroup from "@mui/material/FormGroup";
import SwitchGrey from "./SwitchGrey";
import {triggerAudio} from "../Audio";
import {triggerScroll} from "../PageScroll";
import {triggerCompleteTile} from "../Tile/CompleteTile";
import SliderGrey from "./SliderGrey";
import {changeLineWidth} from "../Stroke/StrokeWidth";

export function hideControlPanel() {
    const controlPanelBackground = document.getElementById("controlPanelBackground");
    controlPanelBackground.style.display = 'none'
    gsap.to("#controlPanel", {left: -window.innerWidth + 'px', duration: 1, delay: 0})
}

export function showControlPanel() {
    const controlPanelBackground = document.getElementById("controlPanelBackground");
    controlPanelBackground.style.display = ''
    gsap.to("#controlPanel", {left: '0px', duration: 1, delay: 0})
}

export default function ControlPanel() {
    return (
        <div>
            <div id="controlPanel">
                <div style={{padding: '30px', fontSize: '1.5em'}}>Control Panel</div>
                <FormGroup style={{paddingLeft: '30px'}}>
                    <SwitchGrey name="Music" fn={triggerAudio}/>
                    <SwitchGrey name="Show Feedback" fn={triggerAudio}/>
                    <SwitchGrey name="Show Colour Preview" fn={triggerAudio}/>
                    <SwitchGrey name="Auto Page Scroll" fn={triggerScroll}/>
                    <SwitchGrey name="Auto Complete Tile" fn={triggerCompleteTile}/>
                    <SliderGrey name="Line Width" fn={changeLineWidth}/>
                </FormGroup>
            </div>
            <div id="controlPanelBackground" onClick={hideControlPanel}></div>
        </div>
    )
}