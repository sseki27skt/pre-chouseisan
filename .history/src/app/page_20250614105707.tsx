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


const groupedTimes = Array.from({ length: 24 }, (_, h) => {
  const hour = String(h).padStart(2, "0");
  const minutes = ["00", "15", "30", "45"].map((m) => `${hour}:${m}`);
  return { [hour]: minutes };
}).reduce((acc, curr) => ({ ...acc, ...curr }), {});

const allTimes = Object.values(groupedTimes).flat();

export default function MultiTimeScheduler() {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [output, setOutput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [iconCopied, setIconCopied] = useState(false);
  const [showWeekday, setShowWeekday] = useState(false);

  const [timeRange, setTimeRange] = useState<[number, number]>([9, 17]);
  const [timeStep, setTimeStep] = useState<number>(60);

  useEffect(() => {
    const [startHour, endHour] = timeRange;

    const newSelectedTimes = allTimes.filter(time => {
      const [hour, minute] = time.split(':').map(Number);
      const timeValue = hour + minute / 60;

      // 範囲外かチェック
      if (timeValue < startHour || timeValue > endHour) {
        return false;
      }

      // ▼▼▼ 1. ロジックを更新: 2時間・3時間刻みの条件を追加 ▼▼▼
      // ステップ（刻み幅）に合致するかチェック
      if (timeStep === 180) { // 3時間
        return minute === 0 && hour % 3 === 0;
      }
      if (timeStep === 120) { // 2時間
        return minute === 0 && hour % 2 === 0;
      }
      if (timeStep === 60) { // 1時間
        return minute === 0;
      }
      if (timeStep === 30) {
        return minute === 0 || minute === 30;
      }
      // 15分刻みの場合は全ての時間が対象
      return true;
    });

    setSelectedTimes(newSelectedTimes);
  }, [timeRange, timeStep]);


  const handleTimeChange = (time: string, checked: boolean) => {
    setSelectedTimes((prev) =>
      checked ? [...prev, time] : prev.filter((t) => t !== time)
    );
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

    if (selectedTimes.length === 0) {
      const result = selectedDates.map((date) => dateLabel(date)).join("\n");
      setOutput(result);
      return;
    }

    const combinations = selectedDates.flatMap((date) =>
      selectedTimes.map((time) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        return {
          datetime: new Date(`${formattedDate}T${time}`),
          display: `${dateLabel(date)} ${time}〜`,
        };
      })
    );
    combinations.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
    const result = combinations.map((c) => c.display).join("\n");
    setOutput(result);
  };

  const handleCopyAndGo = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setIsCopied(true);
      window.open("https://chouseisan.com/", "_blank");
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  const handleCopyOnly = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setIconCopied(true);
      setTimeout(() => {
        setIconCopied(false);
      }, 2000);
    });
  };

  const handleClearAll = () => {
    setSelectedDates([]);
    setTimeRange([9, 17]);
    setTimeStep(60);
  };
  
  const allHours = Object.keys(groupedTimes).sort();
  const startHour = '07';
  const startIndex = allHours.indexOf(startHour);
  const customOrderedHours = [
    ...allHours.slice(startIndex),
    ...allHours.slice(0, startIndex),
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">調整前さん</h1>
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

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 self-start">
            1. 日付を選択
          </h2>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            className="rounded-md border mx-auto"
          />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-xl font-semibold">2. 時間帯を選択</h2>
            <Button onClick={() => setSelectedTimes([])} variant="ghost" size="sm">
                時間全解除
            </Button>
          </div>

          <div className="p-4 border rounded-lg mb-6 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="time-range">時間範囲</Label>
                <span className="text-sm font-medium">
                  {String(timeRange[0]).padStart(2, '0')}:00 - {String(timeRange[1]).padStart(2, '0')}:00
                </span>
              </div>
              <Slider
                id="time-range"
                value={timeRange}
                onValueChange={(value) => setTimeRange([value[0], value[1]])}
                max={24}
                min={0}
                step={1}
                className="my-4"
              />
            </div>
            
            <div>
              <Label className="mb-2 block">時間刻み</Label>
              {/* ▼▼▼ 2. UIを更新: 「2時間」「3時間」の選択肢を追加 ▼▼▼ */}
              <RadioGroup
                value={String(timeStep)}
                onValueChange={(value) => setTimeStep(Number(value))}
                className="flex flex-wrap items-center gap-x-6 gap-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="180" id="r5" />
                  <Label htmlFor="r5">3時間</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="120" id="r4" />
                  <Label htmlFor="r4">2時間</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="r1" />
                  <Label htmlFor="r1">60分</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="r2" />
                  <Label htmlFor="r2">30分</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15" id="r3" />
                  <Label htmlFor="r3">15分</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {customOrderedHours.map((hour) => (
              <div key={hour}>
                <h3 className="font-semibold mb-2 border-b pb-1">{hour}:00台</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                  {groupedTimes[hour as keyof typeof groupedTimes].map((time) => (
                    <label key={time} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer">
                      <input type="checkbox" value={time} checked={selectedTimes.includes(time)} onChange={(e) => handleTimeChange(e.target.value, e.target.checked)} className="form-checkbox h-4 w-4"/>
                      <span>{time.substring(3)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-x-2 mb-4">
        <Button onClick={handleGenerate}>組み合わせを生成</Button>
        <Button onClick={handleClearAll} variant="secondary" disabled={(!selectedDates || selectedDates.length === 0) && selectedTimes.length === 0}>
          すべてクリア
        </Button>
        <label className="flex items-center gap-x-1 text-sm">
          <input type="checkbox" checked={showWeekday} onChange={(e) => setShowWeekday(e.target.checked)} className="form-checkbox h-4 w-4"/>
          曜日を表示
        </label>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">3. 出力して調整さんへ</h2>
            <Button onClick={handleCopyAndGo} disabled={!output}>
              {isCopied ? "コピーして移動中..." : "コピーして調整さんへ"}
            </Button>
          </div>
          <div className="relative">
            <Textarea value={output} rows={10} readOnly placeholder="ここに組み合わせが出力されます..."/>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopyOnly} disabled={!output}>
              {iconCopied ? (<Check className="h-4 w-4" />) : (<Copy className="h-4 w-4" />)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}