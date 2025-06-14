import { Messages } from './types';

export function getMessages(): Messages {
  return {
    title: '調整前さん',
    description: 'このアプリで予定を簡単に管理できます。',
    howToUse: '「調整さん，時間候補複数あるとめんどくさい問題」を解決します．\n\n【使い方】\n1. 日付を選ぶ → 2. 時間帯を選ぶ → 3. ボタンを押せば、調整さんにそのまま貼り付けられる候補リストが完成！',
    dateSelect: '1. 日付を選択',
    clearDate: '日付選択解除',
    timeSelect: '2. 時間帯を選択',
    clearTime: '時間選択解除',
    timeRange: '時間範囲',
    timeStep: '時間刻み',
    periodSelect: '時限で選択',
    clearPeriod: '時限全解除',
    outputTitle: '3. 出力して調整さんへ',
    copyAndGo: 'コピーして調整さんへ',
    copyOnly: 'コピー',
    showWeekday: '曜日を表示',
    outputPlaceholder: 'ここに組み合わせが出力されます...',
    periodNames: ['1限', '2限', '3限', '4限', '5限', '6限', '7限', '8限'],
    tabTime: '時間で選択',
    tabPeriod: '時限で選択',
    timeStepOptions: [
      { value: 180, label: '3時間' },
      { value: 120, label: '2時間' },
      { value: 60, label: '60分' },
      { value: 30, label: '30分' },
      { value: 15, label: '15分' },
    ],
  };
}
