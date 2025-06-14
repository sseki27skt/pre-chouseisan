"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
// ★ 1. アイコンをインポートする
import { Copy, Check } from "lucide-react";

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
  // ★ 2. アイコンボタン用のコピー状態を追加
  const [iconCopied, setIconCopied] = useState(false);
  const [showWeekday, setShowWeekday] = useState(false);

  // ... (handleTimeChange は変更なし) ...
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
    // 曜日を表示するかどうか
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

  // ★ 3. 「コピーだけする」関数を新しく作成
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
    setSelectedTimes([]);
    setOutput("");
  };
  const handleBulkSelect = (
    type: "morning" | "afternoon" | "evening" | "all" | "none"
  ) => {
    let newSelectedTimes: string[] = [];
    switch (type) {
      case "morning":
        newSelectedTimes = allTimes.filter((t) => t >= "09:00" && t < "12:00");
        break;
      case "afternoon":
        newSelectedTimes = allTimes.filter((t) => t >= "13:00" && t < "18:00");
        break;
      case "evening":
        newSelectedTimes = allTimes.filter((t) => t >= "19:00" && t < "23:00");
        break;
      case "all":
        newSelectedTimes = [...allTimes];
        break;
      case "none":
        newSelectedTimes = [];
        break;
    }
    setSelectedTimes(newSelectedTimes);
  };

  // 全ての時間を数値順で取得
const allHours = Object.keys(groupedTimes).sort(); // ["00", "01", ..., "23"]

// 開始したい時間
const startHour = '07';

// 開始時間のインデックスを見つける
const startIndex = allHours.indexOf(startHour);

// 7時以降と7時より前で配列を分割し、順番を入れ替えて結合する
const customOrderedHours = [
  ...allHours.slice(startIndex), // "07" から "23" まで
  ...allHours.slice(0, startIndex)  // "00" から "06" まで
];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* ... (h1, 日付・時間選択部分は変更なし) ... */}
      <h1 className="text-2xl font-bold mb-4">調整前さん</h1>
      {/* ★ ここに説明文を追加します */}
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
            <div className="flex items-center gap-x-2">
              <Button
                onClick={() => handleBulkSelect("morning")}
                variant="outline"
                size="sm"
              >
                午前
              </Button>
              <Button
                onClick={() => handleBulkSelect("afternoon")}
                variant="outline"
                size="sm"
              >
                午後
              </Button>
              <Button
                onClick={() => handleBulkSelect("evening")}
                variant="outline"
                size="sm"
              >
                夜間
              </Button>
              <Button
                onClick={() => handleBulkSelect("all")}
                variant="ghost"
                size="sm"
              >
                全選択
              </Button>
              <Button
                onClick={() => handleBulkSelect("none")}
                variant="ghost"
                size="sm"
              >
                全解除
              </Button>
            </div>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {/* 👇 Object.keysでキーの配列を取得し、明示的にソートする */}
            {Object.keys(groupedTimes)
              .sort()
              .map((hour) => (
                <div key={hour}>
                  <h3 className="font-semibold mb-2 border-b pb-1">
                    {hour}:00台
                  </h3>
                  <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                    {/* 👇 groupedTimesから対応するminutesを取得 */}
                    {groupedTimes[hour as keyof typeof groupedTimes].map(
                      (time) => (
                        <label
                          key={time}
                          className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={time}
                            checked={selectedTimes.includes(time)}
                            onChange={(e) =>
                              handleTimeChange(e.target.value, e.target.checked)
                            }
                            className="form-checkbox h-4 w-4"
                          />
                          <span>{time.substring(3)}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-x-2 mb-4">
        <Button onClick={handleGenerate}>組み合わせを生成</Button>
        <Button
          onClick={handleClearAll}
          variant="secondary"
          disabled={
            (!selectedDates || selectedDates.length === 0) &&
            selectedTimes.length === 0
          }
        >
          すべてクリア
        </Button>
        {/* 曜日表示オプション */}
        <label className="flex items-center gap-x-1 text-sm">
          <input
            type="checkbox"
            checked={showWeekday}
            onChange={(e) => setShowWeekday(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
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
          {/* ★ 4. テキストエリアとアイコンボタンを配置 */}
          <div className="relative">
            <Textarea
              value={output}
              rows={10}
              readOnly
              placeholder="ここに組み合わせが出力されます..."
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCopyOnly}
              disabled={!output}
            >
              {iconCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
