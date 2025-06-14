// ============== 2. 親コンポーネント ==============
export default function MultiTimeScheduler() {
  // --- 状態管理 (State) ---
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);
  const [output, setOutput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [iconCopied, setIconCopied] = useState(false);
  const [showWeekday, setShowWeekday] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'time' | 'period'>('time');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([9, 17]);
  const [timeStep, setTimeStep] = useState<number>(60);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

  // --- ロジック (useEffect, Handlers) ---
  useEffect(() => {
    if (selectionMode !== 'time') return;

    const [startHourFloat, endHourFloat] = timeRange;
    const startTimeInMinutes = startHourFloat * 60;

    const newSelectedTimes = allTimes.filter(time => {
      const [hour, minute] = time.split(':').map(Number);
      const timeValue = hour + minute / 60;

      if (timeValue < startHourFloat || timeValue > endHourFloat) {
        return false;
      }
      const currentTimeInMinutes = hour * 60 + minute;
      const diffInMinutes = currentTimeInMinutes - startTimeInMinutes;
      return diffInMinutes >= 0 && diffInMinutes % timeStep === 0;
    });
    setSelectedTimes(newSelectedTimes);
  }, [timeRange, timeStep, selectionMode]);

  const handleTimeChange = (time: string, checked: boolean) => {
    setSelectedTimes((prev) =>
      checked ? [...prev, time] : prev.filter((t) => t !== time)
    );
  };
  
  const handlePeriodChange = (periodId: number, checked: boolean) => {
    setSelectedPeriods((prev) =>
      checked ? [...prev, periodId] : prev.filter((p) => p !== periodId)
    );
  };

  // ★ 変更点: タブ切り替え時の処理を行う新しいハンドラ関数
  const handleTabChange = (newMode: 'time' | 'period') => {
    if (newMode === selectionMode) return; // 同じタブなら何もしない

    // 新しいタブが 'period' の場合、時間の選択をリセット
    if (newMode === 'period') {
      setSelectedTimes([]);
    }

    // 新しいタブが 'time' の場合、時限の選択をリセット
    if (newMode === 'time') {
      setSelectedPeriods([]);
    }

    setSelectionMode(newMode); // 最後にタブの状態を更新
  };

  const handleGenerate = () => {
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
    } else { // 'period'モード
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
  };

  const handleCopyAndGo = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setIsCopied(true);
      window.open("https://chouseisan.com/", "_blank");
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleCopyOnly = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setIconCopied(true);
      setTimeout(() => setIconCopied(false), 2000);
    });
  };

  const handleClearAll = () => {
    setSelectedDates([]);
    setTimeRange([9, 17]);
    setTimeStep(60);
    setSelectedPeriods([]);
    setOutput("");
  };

  // --- レンダリング ---
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">調整前さん</h1>
      
      <IntroductorySection />
      
      <DateSelectorCard 
        selectedDates={selectedDates} 
        onSelect={setSelectedDates} 
      />
      
      <TimeSelectionCard 
        selectionMode={selectionMode}
        onSelectionModeChange={handleTabChange} // ★ 変更点: 新しいハンドラを渡す
        timeProps={{
          selectedTimes,
          handleTimeChange,
          timeRange,
          setTimeRange,
          timeStep,
          setTimeStep,
          setSelectedTimes,
        }}
        periodProps={{
          selectedPeriods,
          handlePeriodChange,
          setSelectedPeriods
        }}
      />
      
      <ActionControls 
        onGenerate={handleGenerate}
        onClearAll={handleClearAll}
        showWeekday={showWeekday}
        onShowWeekdayChange={(e) => setShowWeekday(e.target.checked)}
      />

      <OutputCard
        output={output}
        isCopied={isCopied}
        iconCopied={iconCopied}
        onCopyAndGo={handleCopyAndGo}
        onCopyOnly={handleCopyOnly}
      />
    </div>
  );
}