import React from "react";
import Styles from "./otpInput.module.css"

const OtpInputGroup = ({setInputValues, inputValues = {}}: any) => {

  
    const handleInputChange = (inputId: any, value: any) => {
        setInputValues((prevInputValues: any) => ({
            ...prevInputValues,
            [inputId]: value,
        }));
    };

    return (
        <>
            <div id="OTPInputGroup" className={Styles.digitGroup} data-autosubmit="true"
            >
                {Object.keys(inputValues).map((inputId, index) => {
                    return(
                    <OTPInput
                        key={index}
                        id={inputId}
                        value={inputValues[inputId]}
                        onValueChange={handleInputChange}
                        previousId={index > 0 ? `input${index}` : null}
                        nextId={index < Object.keys(inputValues).length - 1 ? `input${index + 2}` : ""}
                      
                    />
                )
            })}
            </div>
        </>
    );
}


const OTPInput = ({ id, previousId, nextId, value, onValueChange }: any) => {
    const handleKeyUp = (e: any) => {
        if (previousId && (e.keyCode === 8 || e.keyCode === 37)) {
            const prev = document.getElementById(previousId);
            if (prev) {
                prev.focus();
            }
        } else if (nextId && nextId !== "" && (
            (e.keyCode >= 48 && e.keyCode <= 57) || 
            (e.keyCode >= 65 && e.keyCode <= 90) || 
            (e.keyCode >= 96 && e.keyCode <= 105) ||
            e.keyCode === 39 
        )) {
            const next = document.getElementById(nextId);
            if (next) {
                next.focus(); 
            }
        } else {
            const inputGroup = document.getElementById('OTPInputGroup');
            if (inputGroup && inputGroup.dataset['autosubmit']) {
                
            }
        }
    };
    
    
    

    const handlePaste = (e: any) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        if (pastedData.length === 6) {
            const inputs = document.querySelectorAll('.OTPInput');
            if (inputs.length === 6) {
                inputs.forEach((input:any, index) => {
                    input.value = pastedData[index];
                    onValueChange(`input${index + 1}`, pastedData[index]);
                });
            }
        }
    };
    
    
    return (
        <div>
      <input
    id={id}
    name={id}
    type="text"
    className={Styles.DigitInput + " OTPInput"}
    value={value}
    maxLength={1} 
    onChange={(e) => onValueChange(id, e.target.value)}
    onKeyUp={handleKeyUp}
    onPaste={handlePaste}
    title="Enter a digit"
/>

        </div>
    );
};

export default OtpInputGroup;