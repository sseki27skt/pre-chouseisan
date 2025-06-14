import { useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";

const periodSettings = [
  { id: 1, name: '1限', startTime: '09:00' },
  { id: 2, name: '2限', startTime: '10:30' },
  { id: 3, name: '3限', startTime: '12:00' },
  { id: 4, name: '4限', startTime: '13:30' },
  { id: 5, name: '5限', startTime: '15:00' },
  { id: 6, name: '6限', startTime: '16:30' },
  { id: 7, name: '7限', startTime: '18:00' },
  { id: 8, name: '8限', startTime: '19:30' },
];

export function useGenerateOutput({
  selectedDates,
  selectedTimes,
  selectedPeriods,
  selectionMode,
  showWeekday,
  allTimes,
  setOutput
}: {
  selectedDates: Date[] | undefined,
  selectedTimes: string[],
  selectedPeriods: number[],
  selectionMode: 'time' | 'period',
  showWeekday: boolean,
  allTimes: string[],
  setOutput: (output: string) => void
}) {
  useEffect(() => {
    if (!selectedDates || selectedDates.length === 0) {
      setOutput("");
      return;
    }
    const dateLabel = (date: Date) =>
      showWeekday
        ? format(date, "M/d(E)", { locale: ja })
        : format(date, "M/d");

    let combinations: { datetime: Date; display: string }[] = [];

    if (selectionMode === 'time') {
      if (selectedTimes.length === 0) {
        setOutput(selectedDates.map((date) => dateLabel(date)).join("\n"));
        return;
      }
      combinations = selectedDates.flatMap((date) =>
        selectedTimes.map((time) => ({
          datetime: new Date(`${format(date, "yyyy-MM-dd")}T${time}`),
          display: `${dateLabel(date)} ${time}〜`,
        }))
      );
    } else {
      if (selectedPeriods.length === 0) {
        setOutput(selectedDates.map((date) => dateLabel(date)).join("\n"));
        return;
      }
      const periodsToGenerate = periodSettings.filter(p => selectedPeriods.includes(p.id));
      combinations = selectedDates.flatMap((date) =>
        periodsToGenerate.map((period) => ({
          datetime: new Date(`${format(date, "yyyy-MM-dd")}T${period.startTime}`),
          display: `${dateLabel(date)} ${period.name}`,
        }))
      );
    }
    combinations.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
    setOutput(combinations.map((c) => c.display).join("\n"));
  }, [selectedDates, selectedTimes, selectedPeriods, selectionMode, showWeekday, allTimes, setOutput]);
}
