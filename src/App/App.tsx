import React, {useEffect, useState} from 'react';
import styles from './App.module.sass';
import Calendar, {CalendarEvent} from '../Calendar/Calendar';
import axios from 'axios';
import y from 'js-yaml';
import EventList from '../EventList/EventList';
import Date2 from '../lib/Date2';
import queryString from 'query-string';


const App: React.FC = () => {
  const query = queryString.parse(window.location.search);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const {selected, title} = query;
  const [date, setDate] = useState(selected ? new Date(selected.toString()) : new Date());
  const selectedEvents = () => {
    return events.filter((e) =>
      new Date2(e.start).isSameDayAs(date) ||
      new Date2(e.end).isSameDayAs(date)
    );
  };
  useEffect(() => {
    if (!query.eventsUrl) {return;}
    if (query.title) {
      document.title = query.title as string;
    }
    axios.get(query.eventsUrl.toString()).then((response) => {
      const data = y.safeLoad<CalendarEvent[]>(response.data);
      setEvents(data);
    });
  }, []);
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>{title || '课程表'} - 建议收藏</h1>
      <p className={styles.p}>小圆点表示有课程</p>
      <Calendar events={events} value={date} onChange={setDate}/>
      <EventList title={`${new Date2(date).toString('M月d日')}的安排`} events={selectedEvents()}/>
      <footer className={styles.footer}>本页面使用 React 构建，源代码托管于 &nbsp;
        <a href="https://github.com/FrankFang/gnomon" target="_blank">FrankFang/gnomon</a>
      </footer>
    </div>
  );
};

export default App;
