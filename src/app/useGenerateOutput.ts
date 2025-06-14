import { useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";

const periodSettings = [
  { id: 1, name: '1限'},
  { id: 2, name: '2限'},
  { id: 3, name: '3限'},
  { id: 4, name: '4限'},
  { id: 5, name: '5限'},
  { id: 6, name: '6限'},
  { id: 7, name: '7限'},
  { id: 8, name: '8限'},
];

export function useGenerateOutput({
  selectedDates,
  selectedTimes,
  selectedPeriods,
  selectionMode,
  showWeekday,
//   allTimes,
  setOutput
}: {
  selectedDates: Date[] | undefined,
  selectedTimes: string[],
  selectedPeriods: number[],
  selectionMode: 'time' | 'period',
  showWeekday: boolean,
//   allTimes: string[],
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

    let combinations: { display: string }[] = [];

    if (selectionMode === 'time') {
      if (selectedTimes.length === 0) {
        setOutput(selectedDates.map((date) => dateLabel(date)).join("\n"));
        return;
      }
      combinations = selectedDates.flatMap((date) =>
        selectedTimes.map((time) => ({
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
          display: `${dateLabel(date)} ${period.name}`,
        }))
      );
    }
    setOutput(combinations.map((c) => c.display).join("\n"));
//   }, [selectedDates, selectedTimes, selectedPeriods, selectionMode, showWeekday, allTimes, setOutput]);
  }, [selectedDates, selectedTimes, selectedPeriods, selectionMode, showWeekday, setOutput]);
}
