"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Copy, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateOutput } from "./useGenerateOutput";

// --- 定数 (変更なし) ---
const groupedTimes = Array.from({ length: 24 }, (_, h) => {
  const hour = String(h).padStart(2, "0");
  const minutes = ["00", "15", "30", "45"].map((m) => `${hour}:${m}`);
  return { [hour]: minutes };
}).reduce((acc, curr) => ({ ...acc, ...curr }), {});

const allTimes = Object.values(groupedTimes).flat();

const periodSettings = [
  { id: 1, name: '1限', startTime: '09:00', endTime: '10:30' },
  { id: 2, name: '2限', startTime: '10:40', endTime: '12:10' },
  { id: 3, name: '3限', startTime: '13:00', endTime: '14:30' },
  { id: 4, name: '4限', startTime: '14:40', endTime: '16:10' },
  { id: 5, name: '5限', startTime: '16:20', endTime: '17:50' },
  { id: 6, name: '6限', startTime: '18:00', endTime: '19:30' },
  { id: 7, name: '7限', startTime: '19:40', endTime: '21:10' },
  { id: 8, name: '8限', startTime: '21:20', endTime: '22:50' },
];

// ============== 1. 子コンポーネント定義 ==============

// 説明セクション
const IntroductorySection = () => (
  <div className="mb-6 p-4 bg-slate-50 border rounded-lg text-slate-700">
    <p className="mb-2">
      「調整さん，時間候補複数あるとめんどくさい問題」を解決します．
    </p>
    <p>
      <strong>使い方</strong>
      <br />
      1. 日付を選ぶ → 2. 時間帯を選ぶ → 3.
      ボタンを押せば、調整さんにそのまま貼り付けられる候補リストが完成！
    </p>
  </div>
);

// 日付選択カード
type DateSelectorCardProps = {
  selectedDates: Date[] | undefined;
  onSelect: (dates: Date[] | undefined) => void;
};

const DateSelectorCard: React.FC<DateSelectorCardProps> = ({ selectedDates, onSelect }) => (
  <Card className="mb-4">
    <CardContent className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2 self-start">
        1. 日付を選択
      </h2>
      <Calendar
        mode="multiple"
        selected={selectedDates}
        onSelect={onSelect}
        className="rounded-md border mx-auto"
      />
    </CardContent>
  </Card>
);

// 時間帯・時限選択カード
type TimeSelectionCardProps = {
  selectionMode: 'time' | 'period';
  onSelectionModeChange: (value: string) => void;
  timeProps: {
    selectedTimes: string[];
    handleTimeChange: (time: string, checked: boolean) => void;
    timeRange: [number, number];
    setTimeRange: (range: [number, number]) => void;
    timeStep: number;
    setTimeStep: (step: number) => void;
    setSelectedTimes: (times: string[]) => void;
  };
  periodProps: {
    selectedPeriods: number[];
    handlePeriodChange: (periodId: number, checked: boolean) => void;
    setSelectedPeriods: (periods: number[]) => void;
  };
};

const TimeSelectionCard: React.FC<TimeSelectionCardProps> = ({ 
  selectionMode, onSelectionModeChange, timeProps, periodProps 
}) => {
  
  const formatSliderValue = (value: number) => {
    const hours = Math.floor(value);
    const minutes = (value - hours) * 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  const allHours = Object.keys(groupedTimes).sort();
  const startHour = '07';
  const startIndex = allHours.indexOf(startHour);
  const customOrderedHours = [
    ...allHours.slice(startIndex),
    ...allHours.slice(0, startIndex),
  ];

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">2. 時間帯を選択</h2>
        <Tabs value={selectionMode} onValueChange={onSelectionModeChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="time">時間で選択</TabsTrigger>
            <TabsTrigger value="period">時限で選択</TabsTrigger>
          </TabsList>

          <TabsContent value="time" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => timeProps.setSelectedTimes([])} variant="ghost" size="sm">
                  時間全解除
              </Button>
            </div>
            <div className="p-4 border rounded-lg mb-6 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="time-range">時間範囲</Label>
                  <span className="text-sm font-medium">
                    {formatSliderValue(timeProps.timeRange[0])} - {formatSliderValue(timeProps.timeRange[1])}
                  </span>
                </div>
                <Slider id="time-range" value={timeProps.timeRange} onValueChange={timeProps.setTimeRange} max={24} min={0} step={0.5} className="my-4"/>
              </div>
              <div>
                <Label className="mb-2 block">時間刻み</Label>
                <RadioGroup value={String(timeProps.timeStep)} onValueChange={(v) => timeProps.setTimeStep(Number(v))} className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="180" id="r5" /><Label htmlFor="r5">3時間</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="120" id="r4" /><Label htmlFor="r4">2時間</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="60" id="r1" /><Label htmlFor="r1">60分</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="30" id="r2" /><Label htmlFor="r2">30分</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="15" id="r3" /><Label htmlFor="r3">15分</Label></div>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {customOrderedHours.map((hour) => (
                <div key={hour}>
                  <h3 className="font-semibold mb-2 border-b pb-1">{hour}:00台</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                    {groupedTimes[hour].map((time) => (
                      <label key={time} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer">
                        <input type="checkbox" value={time} checked={timeProps.selectedTimes.includes(time)} onChange={(e) => timeProps.handleTimeChange(e.target.value, e.target.checked)} className="form-checkbox h-4 w-4"/>
                        <span>{time.substring(3)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="period" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => periodProps.setSelectedPeriods([])} variant="ghost" size="sm">
                時限全解除
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {periodSettings.map((period) => (
                  <label key={period.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={periodProps.selectedPeriods.includes(period.id)}
                      onChange={(e) => periodProps.handlePeriodChange(period.id, e.target.checked)}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>{period.name} ({period.startTime})</span>
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// 操作ボタン
type ActionControlsProps = {
  onGenerate: () => void;
  onClearAll: () => void;
  showWeekday: boolean;
  onShowWeekdayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ActionControls: React.FC<ActionControlsProps> = ({
  onGenerate,
  onClearAll,
  showWeekday,
  onShowWeekdayChange,
}) => (
  <div className="flex items-center gap-x-2 mb-4">
    <Button onClick={onGenerate}>組み合わせを生成</Button>
    <Button onClick={onClearAll} variant="secondary">
      すべてクリア
    </Button>
    <label className="flex items-center gap-x-1 text-sm">
      <input type="checkbox" checked={showWeekday} onChange={onShowWeekdayChange} className="form-checkbox h-4 w-4"/>
      曜日を表示
    </label>
  </div>
);

// 出力カード
type OutputCardProps = {
  output: string;
  onCopyAndGo: () => void;
  isCopied: boolean;
  onCopyOnly: () => void;
  iconCopied: boolean;
};

const OutputCard: React.FC<OutputCardProps> = ({ output, onCopyAndGo, isCopied, onCopyOnly, iconCopied }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">3. 出力して調整さんへ</h2>
        <Button onClick={onCopyAndGo} disabled={!output}>
          {isCopied ? "コピーして移動中..." : "コピーして調整さんへ"}
        </Button>
      </div>
      <div className="relative">
        <Textarea value={output} rows={10} readOnly placeholder="ここに組み合わせが出力されます..."/>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onCopyOnly} disabled={!output}>
          {iconCopied ? (<Check className="h-4 w-4" />) : (<Copy className="h-4 w-4" />)}
        </Button>
      </div>
    </CardContent>
  </Card>
);


// ============== 2. 親コンポーネント ==============
export default function MultiTimeScheduler() {
  // --- 状態管理 (State) ---
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [iconCopied, setIconCopied] = useState(false);
  const [showWeekday, setShowWeekday] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'time' | 'period'>('time');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([9, 17]);
  const [timeStep, setTimeStep] = useState<number>(60);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [output, setOutput] = useState("");

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
  };

  const handleGenerate = () => {
    setOutput(
      generateOutput({
        selectedDates,
        selectedTimes,
        selectedPeriods,
        selectionMode,
        showWeekday,
        allTimes
      })
    );
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
        onSelectionModeChange={(value: string) => setSelectionMode(value as 'time' | 'period')}
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
        onShowWeekdayChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowWeekday(e.target.checked)}
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