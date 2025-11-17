import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

interface TimePickerProps {
  value: string; // Format: "HH:mm" (24-hour)
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  minTime?: string; // "HH:mm" 24-hour format
  maxTime?: string; // "HH:mm" 24-hour format
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
  minTime = "09:00", // Default: 9:00 AM
  maxTime = "18:00", // Default: 6:00 PM
  disabled = false
}) => {
  const [hour, setHour] = useState<number>(9);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // Parse the value prop and update state
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      const isPM = hours >= 12;
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      
      setHour(displayHour);
      setMinute(minutes);
      setPeriod(isPM ? 'PM' : 'AM');
    }
  }, [value]);

  // Convert hour and period to 24-hour format
  const to24Hour = (h: number, p: 'AM' | 'PM'): number => {
    if (p === 'AM') {
      return h === 12 ? 0 : h;
    } else {
      return h === 12 ? 12 : h + 12;
    }
  };

  // Update parent component when time changes
  const updateTime = (newHour: number, newMinute: number, newPeriod: 'AM' | 'PM') => {
    const hour24 = to24Hour(newHour, newPeriod);
    const timeString = `${hour24.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
    
    // Validate against min and max time
    const [minH, minM] = minTime.split(':').map(Number);
    const [maxH, maxM] = maxTime.split(':').map(Number);
    
    const currentMinutes = hour24 * 60 + newMinute;
    const minMinutes = minH * 60 + minM;
    const maxMinutes = maxH * 60 + maxM;
    
    if (currentMinutes >= minMinutes && currentMinutes <= maxMinutes) {
      onChange(timeString);
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = parseInt(e.target.value);
    setHour(newHour);
    updateTime(newHour, minute, period);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = parseInt(e.target.value);
    setMinute(newMinute);
    updateTime(hour, newMinute, period);
  };

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod);
    updateTime(hour, minute, newPeriod);
  };

  // Generate valid hours based on min/max time constraints
  const getValidHours = (): number[] => {
    const [minH] = minTime.split(':').map(Number);
    const [maxH] = maxTime.split(':').map(Number);
    
    const validHours: number[] = [];
    
    for (let h = 1; h <= 12; h++) {
      // Check both AM and PM
      const hour24AM = to24Hour(h, 'AM');
      const hour24PM = to24Hour(h, 'PM');
      
      const isValidAM = period === 'AM' && hour24AM >= minH && hour24AM <= maxH;
      const isValidPM = period === 'PM' && hour24PM >= minH && hour24PM <= maxH;
      
      if ((period === 'AM' && isValidAM) || (period === 'PM' && isValidPM)) {
        validHours.push(h);
      }
    }
    
    return validHours;
  };

  // Generate minutes (in 15-minute intervals for better UX)
  const getMinutes = (): number[] => {
    const minutes: number[] = [];
    for (let m = 0; m < 60; m += 15) {
      minutes.push(m);
    }
    return minutes;
  };

  const validHours = getValidHours();
  const minutes = getMinutes();

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-blue-950 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 border-2 border-blue-950 rounded-lg px-3 py-2 bg-white">
          <FaClock className="text-blue-950" />
          
          {/* Hour Selector */}
          <select
            value={hour}
            onChange={handleHourChange}
            disabled={disabled}
            className="w-16 bg-transparent text-blue-950 font-medium focus:outline-none cursor-pointer"
            required={required}
          >
            {validHours.length === 0 && (
              <option value="">--</option>
            )}
            {validHours.map(h => (
              <option key={h} value={h}>
                {h.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
          
          <span className="text-blue-950 font-bold">:</span>
          
          {/* Minute Selector */}
          <select
            value={minute}
            onChange={handleMinuteChange}
            disabled={disabled}
            className="w-16 bg-transparent text-blue-950 font-medium focus:outline-none cursor-pointer"
            required={required}
          >
            {minutes.map(m => (
              <option key={m} value={m}>
                {m.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
          
          {/* AM/PM Toggle */}
          <div className="ml-2 flex rounded-md overflow-hidden border border-blue-950">
            <button
              type="button"
              onClick={() => handlePeriodChange('AM')}
              disabled={disabled}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                period === 'AM'
                  ? 'bg-blue-950 text-white'
                  : 'bg-white text-blue-950 hover:bg-blue-50'
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('PM')}
              disabled={disabled}
              className={`px-3 py-1 text-xs font-semibold transition-colors ${
                period === 'PM'
                  ? 'bg-blue-950 text-white'
                  : 'bg-white text-blue-950 hover:bg-blue-50'
              }`}
            >
              PM
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mt-1">
        Booking hours: 9:00 AM - 6:00 PM
      </p>
    </div>
  );
};

export default TimePicker;
