import './Bubble.css';

export default function Bubble(props) {
    return (
        <div>
            <div className="bubble-outline-bottom">{props.feedback}</div>
            <div className="bubble bubble-bottom">{props.feedback}</div>
        </div>
    );
}
