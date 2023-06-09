import { useState } from 'react';
import {
    format,
    subMonths,
    addMonths,
    startOfWeek,
    addDays,
    isSameDay,
    lastDayOfWeek,
    getWeek,
    addWeeks,
    subWeeks,
} from 'date-fns';
import { useMainContext } from '../contexts/MainContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface Props {
    showDetailsHandle: (dayStr: string) => void;
}

const Calendar: React.FC<Props> = (prop: Props) => {
    const { loading, setLoading } = useMainContext();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
    const [selectedDate, setSelectedDate] = useState(new Date());

    const changeMonthHandle = (btnType: string) => {
        if (btnType === 'prev') {
            setCurrentMonth(subMonths(currentMonth, 1));
        }
        if (btnType === 'next') {
            setCurrentMonth(addMonths(currentMonth, 1));
        }
    };

    const changeWeekHandle = (btnType: string) => {
        //console.log("current week", currentWeek);
        if (btnType === 'prev') {
            //console.log(subWeeks(currentMonth, 1));
            setCurrentMonth(subWeeks(currentMonth, 1));
            setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
        }
        if (btnType === 'next') {
            //console.log(addWeeks(currentMonth, 1));
            setCurrentMonth(addWeeks(currentMonth, 1));
            setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
        }
    };

    const onDateClickHandle = (day: Date, dayStr: string) => {
        setSelectedDate(day);
        prop.showDetailsHandle(dayStr);
        setLoading(!loading);
    };

    const renderHeader = () => {
        const dateFormat = 'MMM yyyy';
        // console.log("selected day", selectedDate);
        return (
            <div className="header row flex-middle">
                <div className="col col-start" onClick={() => changeMonthHandle('prev')}>
                    <FontAwesomeIcon className="icon" icon={faAngleLeft} />
                </div>
                <div className="col col-center">
                    <span>{format(currentMonth, dateFormat)}</span>
                </div>
                <div className="col col-end" onClick={() => changeMonthHandle('next')}>
                    <FontAwesomeIcon className="icon" icon={faAngleRight} />
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const dateFormat = 'EEE';
        const days = [];
        let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>,
            );
        }
        return <div className="days row">{days}</div>;
    };

    const renderCells = () => {
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
        const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
        const dateFormat = 'd';
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                days.push(
                    <div
                        className={`col cell ${
                            isSameDay(day, new Date()) ? 'today' : isSameDay(day, selectedDate) ? 'selected' : ''
                        }`}
                        key={day.getDay() + i}
                        onClick={() => {
                            const dayStr = format(cloneDay, 'yyyy-MM-dd');
                            onDateClickHandle(cloneDay, dayStr);
                        }}>
                        <span className="number" key={day.getDay() + 'number' + i}>
                            {formattedDate}
                        </span>
                        <span className="bg" key={day.getDay() + 'bg' + i}>
                            {formattedDate}
                        </span>
                    </div>,
                );
                day = addDays(day, 1);
            }

            rows.push(
                <div className="row" key={day.getDay()}>
                    {days}
                </div>,
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    };
    const renderFooter = () => {
        return (
            <div className="header row flex-middle">
                <div className="col col-start" onClick={() => changeWeekHandle('prev')}>
                    <FontAwesomeIcon className="icon" icon={faAngleLeft} />
                </div>
                <div>{'Week ' + currentWeek}</div>
                <div className="col col-end" onClick={() => changeWeekHandle('next')}>
                    <FontAwesomeIcon className="icon" icon={faAngleRight} />
                </div>
            </div>
        );
    };
    return (
        <div className="calendar">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            {renderFooter()}
        </div>
    );
};

export default Calendar;
