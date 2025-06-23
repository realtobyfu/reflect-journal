'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MoodChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export function MoodChart({ data }: MoodChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Mood Trends Over Time',
            font: {
              size: 16,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            min: -1,
            ticks: {
              callback: function(value) {
                if (value === 1) return '😊 Positive';
                if (value === 0) return '😐 Neutral';
                if (value === -1) return '😔 Negative';
                return '';
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

// components/analytics/word-cloud.tsx
'use client';

interface WordCloudProps {
  words: { text: string; size: number }[];
}

export function WordCloud({ words }: WordCloudProps) {
  // Simple word cloud visualization
  const maxSize = Math.max(...words.map(w => w.size));
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4">Frequently Used Words</h3>
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => {
          const fontSize = 12 + (word.size / maxSize) * 20;
          const opacity = 0.5 + (word.size / maxSize) * 0.5;
          
          return (
            <span
              key={index}
              className="transition-all hover:scale-110"
              style={{
                fontSize: `${fontSize}px`,
                opacity,
                color: `hsl(${200 + (word.size / maxSize) * 60}, 70%, 50%)`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// components/analytics/streak-calendar.tsx
'use client';

interface StreakCalendarProps {
  year: number;
  month: number;
  entries: Record<string, { count: number; moods: string[] }>;
}

export function StreakCalendar({ year, month, entries }: StreakCalendarProps) {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-slate-100';
    if (count === 1) return 'bg-blue-200';
    if (count === 2) return 'bg-blue-300';
    if (count >= 3) return 'bg-blue-500';
    return 'bg-slate-100';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4">
        {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h3>
      
      <div className="grid grid-cols-7 gap-1 text-xs mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-slate-500 p-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          
          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const dayData = entries[dateStr] || { count: 0, moods: [] };
          
          return (
            <div
              key={day}
              className={`aspect-square rounded ${getIntensity(dayData.count)} flex items-center justify-center relative group cursor-pointer transition-all hover:scale-110`}
              title={`${dayData.count} entries${dayData.moods.length > 0 ? ` - Moods: ${dayData.moods.join(', ')}` : ''}`}
            >
              <span className="text-xs">{day}</span>
              {dayData.count > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-600">
        <span>Less</span>
        <div className="flex gap-1">
          {['bg-slate-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-500'].map((color, i) => (
            <div key={i} className={`w-3 h-3 rounded ${color}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

// components/analytics/entry-heatmap.tsx
'use client';

interface EntryHeatmapProps {
  data: Record<string, Record<string, number>>; // hour -> day -> count
}

export function EntryHeatmap({ data }: EntryHeatmapProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-slate-100';
    if (count === 1) return 'bg-purple-200';
    if (count === 2) return 'bg-purple-300';
    if (count === 3) return 'bg-purple-400';
    return 'bg-purple-500';
  };
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4">Writing Activity Heatmap</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-8 gap-1 text-xs">
            <div></div>
            {days.map(day => (
              <div key={day} className="text-center text-slate-500 p-1">
                {day}
              </div>
            ))}
          </div>
          
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-1">
              <div className="text-xs text-slate-500 pr-2 flex items-center justify-end">
                {formatHour(hour)}
              </div>
              {days.map((day, dayIndex) => {
                const count = data[hour]?.[dayIndex] || 0;
                return (
                  <div
                    key={`${hour}-${day}`}
                    className={`aspect-square rounded ${getIntensity(count)} transition-all hover:scale-110`}
                    title={`${count} entries at ${formatHour(hour)} on ${day}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mt-4">
        Darker colors indicate more writing activity during that time
      </p>
    </div>
  );
}