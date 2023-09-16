import * as React from 'react';
import {useRef, useEffect, useCallback, useState, useMemo} from 'react';
import {Typography, Box} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface MyTimerProps {
  dateEnd: number;
  onTimeout?: () => void;
  fontSize?: string|number;
}

export const MyTimer: React.FC<MyTimerProps> = (props) => {
  const [oDateTime, setODateTime] = useState<any>(dayjs(props.dateEnd - Date.now()).utc());

  useEffect(() => {
    const timeout = setInterval(() => {
      const diff = props.dateEnd - Date.now();
      if(diff < 1000 && props.onTimeout) props.onTimeout.call(null); 
      setODateTime(dayjs(diff).utc());
    }, 500);
    return () => {
      clearInterval(timeout)
    }
  }, []);

  return (<Box sx={{display: 'flex', color: 'warning.main'}}>
    <Typography sx={{fontWeight: 'bold', ...(props.fontSize?{fontSize: props.fontSize}:{})}}>{oDateTime.hour().toString().padStart(2, '0')}</Typography>
    <Typography sx={{fontWeight: 'bold', ...(props.fontSize?{fontSize: props.fontSize}:{})}}>{':'}</Typography>
    <Typography sx={{fontWeight: 'bold', ...(props.fontSize?{fontSize: props.fontSize}:{})}}>{oDateTime.minute().toString().padStart(2, '0')}</Typography>
    <Typography sx={{fontWeight: 'bold', ...(props.fontSize?{fontSize: props.fontSize}:{})}}>{':'}</Typography>
    <Typography sx={{fontWeight: 'bold', ...(props.fontSize?{fontSize: props.fontSize}:{})}}>{oDateTime.second().toString().padStart(2, '0')}</Typography>
  </Box>);
}
