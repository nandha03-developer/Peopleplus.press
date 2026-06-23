"use client";
import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DatePickerComponents: React.FC = () => {
    const [value, setValue] = useState<Date>(new Date());

    const handleDateChange: CalendarProps['onChange'] = (value) => {
        if (value instanceof Date) {
            setValue(value);
        }
    };

    return (
        <div>
            <Calendar onChange={handleDateChange} value={value} />
        </div>
    );
};

export default DatePickerComponents;
