import * as React from "react";

const SVGComponent = (props) => (
    <div className="PlainAction">
        <svg
            width={21}
            height={21}
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            className="Polaris-Icon__Svg_375hu"
            focusable="false"
            aria-hidden="true"
            {...props}
        >
        <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.166 8.653c4.418 0 8-1.343 8-3s-3.582-3-8-3-8 1.343-8 3 3.582 3 8 3Zm6.93.5c-1.383.897-3.969 1.5-6.93 1.5s-5.546-.603-6.93-1.5c-.68.442-1.07.954-1.07 1.5 0 1.657 3.582 3 8 3s8-1.343 8-3c0-.546-.39-1.058-1.07-1.5Zm0 5c-1.383.897-3.969 1.5-6.93 1.5s-5.546-.603-6.93-1.5c-.68.442-1.07.954-1.07 1.5 0 1.657 3.582 3 8 3s8-1.343 8-3c0-.546-.39-1.058-1.07-1.5Z"
        />
        </svg>
    </div>  
);

export default SVGComponent;