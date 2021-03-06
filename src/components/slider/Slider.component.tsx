import React, {useEffect, useRef, useState} from 'react';
import './temp.css';
import {removeSuffix} from "../../helpers/suffix.helper";

export default function Slider(props) {

    const inputRef = useRef<HTMLInputElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);

    const [isInputFocused, setInputFocused] = useState(false);

    const {values, methods} = props;
    const {updateValue} = methods;
    const {value, suffix} = values;

    const fillAddWidth = 2;
    const maxValue = 100;
    const minValue = 0;

    let inputValue: string = '';
    let shiftX: number = 0;

    useEffect((): any => {
        if (fillRef && fillRef.current && thumbRef && thumbRef.current && sliderRef && sliderRef.current) {
            const rightEdge = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;
            const offset = rightEdge * value / 100;
            thumbRef.current.style.left = offset + 'px';
            fillRef.current.style.width = offset + fillAddWidth + 'px';
        }
    });

    const handleMouseMove = (event): void => {
        if (fillRef && fillRef.current
            && thumbRef && thumbRef.current
            && sliderRef && sliderRef.current
            && inputRef && inputRef.current) {
            let newLeft = event.clientX - shiftX - sliderRef.current.getBoundingClientRect().left;
            if (newLeft < 0) {
                newLeft = 0;
            }
            let rightEdge = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;
            if (newLeft > rightEdge) {
                newLeft = rightEdge;
            }
            inputValue = (newLeft / rightEdge * 100).toFixed(2);
            updateValue(inputValue);
        }
    }

    const handleMouseUp = (): void => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    }

    const thumbOnMouseDown = function (event): void {
        event.preventDefault();
        if (thumbRef && thumbRef.current) {
            shiftX = event.clientX - thumbRef.current.getBoundingClientRect().left;
        }
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleSliderClick = function (event): void {
        if (sliderRef && sliderRef.current) {
            const shift = event.clientX - sliderRef.current.getBoundingClientRect().left;
            const rightEdge = sliderRef.current.offsetWidth
            updateValue((shift / rightEdge * 100).toFixed(2))
        }
    }

    const prepareAndUpdateValue = (event) => {
        const {target: {value}, nativeEvent: {data}} = event;
        console.log(event);
        let currVal = removeSuffix(value, suffix);
        if (typeof parseFloat(currVal) === 'number') {
            if (currVal === '') {
                updateValue('')
            } else if (currVal <= maxValue && currVal >= minValue) {
                const str = currVal.toString();
                const reg = new RegExp(/(.*)\.\d\d\d/);
                if (!reg.test(str) && !(value.length && value[0] === '0' && value[1] !== '.')) {
                    updateValue(currVal)
                }
            } else if (currVal > maxValue) {
                updateValue(maxValue.toFixed(2))
            } else if (currVal < minValue) {
                updateValue(minValue.toFixed(2))
            }

        }
    }

    const handleInputBlur = (event) => {
        setInputFocused(false);
        const {target: {value}} = event;
        let currVal = parseFloat(removeSuffix(value || 0, suffix));
        updateValue(currVal.toFixed(2))
    }

    return (
        <div className="flex">
            <div
                className="flex w-286px m-auto box-border rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-400"
                style={{padding: '35px 30px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}
            >
                <div
                    className="slider flex-shrink-0 my-auto bg-gray-200 m-r-22px"
                    onClick={handleSliderClick}
                    ref={sliderRef}
                >
                    <div className="flex">
                        <div
                            className="bg-blue-600 fill"
                            ref={fillRef}
                        />
                        <div
                            onMouseDown={thumbOnMouseDown}
                            onDragStart={() => false}
                            className="thumb relative cursor-pointer bg-white border rounded border-blue-600 z-50"
                            ref={thumbRef}
                        />
                    </div>
                    <div className="dots flex justify-between">
                        <div
                            className={`w-6px h-6px relative rounded-full -top-2 ${(value > 0) ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white'}`}
                        />
                        <div
                            className={`w-6px h-6px relative rounded-full -top-2 ${(value > 25) ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white'}`}
                        />
                        <div
                            className={`w-6px h-6px relative rounded-full -top-2 ${(value > 50) ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white'}`}
                        />
                        <div
                            className={`w-6px h-6px relative rounded-full -top-2 ${(value > 75) ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white'}`}
                        />
                        <div
                            className={`w-6px h-6px relative rounded-full -top-2 ${(value > 99) ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white'}`}
                        />
                    </div>
                </div>
                <div className="flex box-border w-15 border border-gray-200 dark:border-gray-400 rounded-lg">
                    <div className="flex m-auto pt-2 pb-2 pl-2" style={{width: '62px', height: '36px'}}>
                        <input
                            className="bg-transparent min-w-0 w-auto text-xs my-auto h-18px outline-none"
                            type="text"
                            ref={inputRef}
                            value={value + ((value) ? suffix : '')}
                            onChange={prepareAndUpdateValue}
                            onBlur={handleInputBlur}
                        />
                    </div>
                </div>
            </div>

        </div>
    )

}
