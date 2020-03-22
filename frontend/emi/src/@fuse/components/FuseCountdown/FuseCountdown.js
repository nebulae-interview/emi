import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';

function FuseCountdown(props)
{
    const {onComplete} = props;
    const [endDate] = useState(moment.isMoment(props.endDate) ? props.endDate : moment(props.endDate));
    const [countdown, setCountdown] = useState({
        days   : '',
        hours  : '',
        minutes: '',
        seconds: ''
    });
    const intervalRef = useRef();

    const complete = useCallback(() => {
        window.clearInterval(intervalRef.current);
        if ( onComplete )
        {
            onComplete();
        }
    }, [onComplete]);

    const tick = useCallback(() => {
        const currDate = moment();
        const diff = endDate.diff(currDate, 'seconds');
        if ( diff < 0 )
        {
            complete();
            return;
        }
        const timeLeft = moment.duration(diff, 'seconds');
        setCountdown({
            days   : Math.trunc(timeLeft.asDays()),
            hours  : timeLeft.hours(),
            minutes: timeLeft.minutes(),
            seconds: timeLeft.seconds()
        });
    }, [complete, endDate]);

    useEffect(() => {
        intervalRef.current = setInterval(tick, 1000);
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [tick]);

    return (
        <div className={clsx("flex items-center", props.className)}>
            {/* <div className="flex flex-col items-center justify-center px-12">
                <Typography variant="h4" className="mb-4">
                    {countdown.days}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Días
                </Typography>
            </div> */}
            <div className="flex flex-col items-center justify-center px-12">
                <Typography variant="h4" className="mb-4">
                    {countdown.hours}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Horas
                </Typography>
            </div>
            <div className="flex flex-col items-center justify-center px-12">
                <Typography variant="h4" className="mb-4">
                    {countdown.minutes}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Minutos
                </Typography>
            </div>
            <div className="flex flex-col items-center justify-center px-12">
                <Typography variant="h4" className="mb-4">
                    {countdown.seconds}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Segundos
                </Typography>
            </div>
        </div>
    );
}

FuseCountdown.propTypes = {
    endDate   : PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onComplete: PropTypes.func
};

FuseCountdown.defaultProps = {
    endDate: moment().add(15, 'days')
};

export default React.memo(FuseCountdown);
