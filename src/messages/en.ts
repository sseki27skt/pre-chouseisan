import { Messages } from './types';

export function getMessages(): Messages {
  return {
    title: 'Chouseisan Helper: Easy Time Slot Generator',
    description: 'You can easily manage your schedule with this app.',
    howToUse: 'Solve the “Chouseisan: too many time slots” problem!\n\n【How to use】\n1. Select dates → 2. Select time slots → 3. Press the button to get a list you can paste directly into Chouseisan!',
    dateSelect: '1. Select Dates',
    clearDate: 'Clear Dates',
    timeSelect: '2. Select Time Slots',
    clearTime: 'Clear Times',
    timeRange: 'Time Range',
    timeStep: 'Time Step',
    periodSelect: 'Select by Period',
    clearPeriod: 'Clear Periods',
    outputTitle: '3. Output and Go to Chouseisan',
    copyAndGo: 'Copy & Go to Chouseisan',
    copyOnly: 'Copy',
    showWeekday: 'Show Weekday',
    outputPlaceholder: 'The combinations will be output here...',
    periodNames: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7', 'Period 8'],
    tabTime: 'Select by Time',
    tabPeriod: 'Select by Period',
    timeStepOptions: [
      { value: 180, label: '3 hours' },
      { value: 120, label: '2 hours' },
      { value: 60, label: '60 min' },
      { value: 30, label: '30 min' },
      { value: 15, label: '15 min' },
    ],
  };
}
