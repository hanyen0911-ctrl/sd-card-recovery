import { useState } from 'react';

interface Question {
  id: string;
  text: string;
  options: Array<{
    label: string;
    value: string;
    nextQuestion?: string;
    result?: DiagnosisResult;
  }>;
}

interface DiagnosisResult {
  problemType: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  successRate: number;
  immediateActions: string[];
  recommendedTools: Array<{
    name: string;
    type: 'free' | 'paid';
    platform: string[];
  }>;
  tutorialLink: string;
}

const questions: Question[] = [
  {
    id: 'q1',
    text: 'SD 卡能被電腦/裝置識別嗎？',
    options: [
      { label: '✅ 可以識別，但無法讀取', value: 'detected', nextQuestion: 'q2' },
      { label: '❌ 完全無法識別', value: 'not-detected', nextQuestion: 'q1b' },
      { label: '⚠️ 時而可以時而不行', value: 'unstable', nextQuestion: 'q1c' }
    ]
  },
  {
    id: 'q1b',
    text: '電腦完全無法識別 SD 卡時，讀卡機的指示燈有亮嗎？',
    options: [
      { 
        label: '有亮，但沒有出現磁碟',
        value: 'light-on',
        result: {
          problemType: 'hardware-partial',
          title: 'SD 卡可能有物理損壞',
          severity: 'high',
          successRate: 40,
          immediateActions: [
            '嘗試更換讀卡機或使用其他電腦',
            '檢查 SD 卡金屬接點是否氧化或髒污',
            '如果重要資料，考慮送專業資料救援公司'
          ],
          recommendedTools: [
            { name: '專業資料救援服務', type: 'paid', platform: ['專業實驗室'] }
          ],
          tutorialLink: '/tutorials/hardware-check'
        }
      },
      { 
        label: '完全沒有任何反應',
        value: 'no-light',
        result: {
          problemType: 'hardware-dead',
          title: 'SD 卡可能已完全損壞',
          severity: 'high',
          successRate: 10,
          immediateActions: [
            '確認讀卡機本身正常（測試其他 SD 卡）',
            '檢查 SD 卡是否有明顯物理損傷',
            '建議送專業資料救援公司評估'
          ],
          recommendedTools: [
            { name: '專業資料救援服務', type: 'paid', platform: ['專業實驗室'] }
          ],
          tutorialLink: '/tutorials/hardware-failure'
        }
      }
    ]
  },
  {
    id: 'q1c',
    text: 'SD 卡不穩定的情況，最常發生在什麼時候？',
    options: [
      {
        label: '插拔時接觸不良',
        value: 'contact-issue',
        result: {
          problemType: 'connection-issue',
          title: '接觸不良問題',
          severity: 'low',
          successRate: 80,
          immediateActions: [
            '清潔 SD 卡金屬接點（使用橡皮擦輕擦）',
            '更換品質較好的讀卡機',
            '確保 SD 卡插入到底'
          ],
          recommendedTools: [
            { name: '清潔工具 + 新讀卡機', type: 'free', platform: ['所有平台'] }
          ],
          tutorialLink: '/tutorials/connection-fix'
        }
      },
      {
        label: '使用一段時間後突然斷開',
        value: 'overheat',
        result: {
          problemType: 'stability-issue',
          title: 'SD 卡穩定性問題',
          severity: 'medium',
          successRate: 60,
          immediateActions: [
            '可能是卡片老化或過熱',
            '立即備份現有可讀取的資料',
            '考慮更換新的 SD 卡'
          ],
          recommendedTools: [
            { name: '檔案備份工具', type: 'free', platform: ['Windows', 'macOS'] }
          ],
          tutorialLink: '/tutorials/backup-unstable-card'
        }
      }
    ]
  },
  {
    id: 'q2',
    text: '發生了什麼狀況？',
    options: [
      { label: '🔄 意外格式化了', value: 'formatted', nextQuestion: 'q3' },
      { label: '🗑️ 誤刪了檔案', value: 'deleted', nextQuestion: 'q4' },
      { label: '⚠️ 顯示「需要格式化」錯誤', value: 'format-error', nextQuestion: 'q5' },
      { label: '📂 檔案無法開啟或損壞', value: 'file-corrupted', nextQuestion: 'q6' }
    ]
  },
  {
    id: 'q3',
    text: '格式化後過了多久？',
    options: [
      {
        label: '剛剛（1 小時內）',
        value: 'recent',
        nextQuestion: 'q3b'
      },
      {
        label: '今天（24 小時內）',
        value: 'today',
        nextQuestion: 'q3b'
      },
      {
        label: '幾天前',
        value: 'days-ago',
        result: {
          problemType: 'formatted-old',
          title: '格式化後已過數天',
          severity: 'high',
          successRate: 60,
          immediateActions: [
            '立即停止使用該 SD 卡',
            '如果期間有寫入新資料，救援難度增加',
            '使用深度掃描工具'
          ],
          recommendedTools: [
            { name: 'PhotoRec', type: 'free', platform: ['Windows', 'macOS', 'Linux'] },
            { name: 'EaseUS Data Recovery', type: 'paid', platform: ['Windows', 'macOS'] }
          ],
          tutorialLink: '/tutorials/photorec-deep-scan'
        }
      }
    ]
  },
  {
    id: 'q3b',
    text: '格式化後有寫入新的資料嗎？',
    options: [
      {
        label: '沒有，發現後立即停止使用',
        value: 'no-new-data',
        result: {
          problemType: 'formatted-clean',
          title: '格式化後未寫入新資料',
          severity: 'medium',
          successRate: 95,
          immediateActions: [
            '✅ 成功率很高！',
            '立即使用救援工具掃描',
            '不要再對該 SD 卡進行任何操作'
          ],
          recommendedTools: [
            { name: 'Recuva', type: 'free', platform: ['Windows'] },
            { name: 'PhotoRec', type: 'free', platform: ['Windows', 'macOS', 'Linux'] },
            { name: 'Disk Drill', type: 'paid', platform: ['macOS', 'Windows'] }
          ],
          tutorialLink: '/tutorials/formatted-recovery'
        }
      },
      {
        label: '有寫入一些新資料',
        value: 'has-new-data',
        result: {
          problemType: 'formatted-overwritten',
          title: '格式化後有寫入資料',
          severity: 'high',
          successRate: 70,
          immediateActions: [
            '⚠️ 新資料可能已覆蓋部分舊檔案',
            '立即停止使用',
            '使用專業工具進行深度掃描'
          ],
          recommendedTools: [
            { name: 'PhotoRec', type: 'free', platform: ['Windows', 'macOS', 'Linux'] },
            { name: 'EaseUS Data Recovery', type: 'paid', platform: ['Windows', 'macOS'] },
            { name: 'Stellar Photo Recovery', type: 'paid', platform: ['Windows', 'macOS'] }
          ],
          tutorialLink: '/tutorials/overwritten-recovery'
        }
      }
    ]
  },
  {
    id: 'q4',
    text: '刪除後有寫入新的資料嗎？',
    options: [
      {
        label: '沒有，立即發現',
        value: 'delete-no-new',
        result: {
          problemType: 'deleted-clean',
          title: '誤刪後未寫入新資料',
          severity: 'low',
          successRate: 95,
          immediateActions: [
            '✅ 救援成功率非常高！',
            '立即使用救援工具',
            '檔案名稱和資料夾結構通常可保留'
          ],
          recommendedTools: [
            { name: 'Recuva', type: 'free', platform: ['Windows'] },
            { name: 'PhotoRec', type: 'free', platform: ['Windows', 'macOS', 'Linux'] },
            { name: 'TestDisk', type: 'free', platform: ['Windows', 'macOS', 'Linux'] }
          ],
          tutorialLink: '/tutorials/deleted-recovery'
        }
      },
      {
        label: '有繼續使用',
        value: 'delete-new-data',
        result: {
          problemType: 'deleted-partial',
          title: '誤刪後有繼續使用',
          severity: 'medium',
          successRate: 70,
          immediateActions: [
            '部分檔案可能已被覆蓋',
            '立即停止使用',
            '越早救援成功率越高'
          ],
          recommendedTools: [
            { name: 'PhotoRec', type: 'free', platform: ['Windows', 'macOS', 'Linux'] },
            { name: 'R-Studio', type: 'paid', platform: ['Windows', 'macOS', 'Linux'] }
          ],
          tutorialLink: '/tutorials/partial-deleted-recovery'
        }
      }
    ]
  },
  {
    id: 'q5',
    text: '顯示「需要格式化」錯誤時，點了格式化按鈕嗎？',
    options: [
      {
        label: '沒有，立即取消',
        value: 'not-formatted',
        result: {
          problemType: 'filesystem-error',
          title: '檔案系統損壞（未格式化）',
          severity: 'medium',
          successRate: 85,
          immediateActions: [
            '✅ 很好！沒有格式化是正確的',
            '這通常是檔案系統表損壞',
            '可以使用修復工具嘗試修復'
          ],
          recommendedTools: [
            { name: 'TestDisk', type: 'free', platform: ['Windows', 'macOS', 'Linux'] },
            { name: 'CHKDSK (Windows內建)', type: 'free', platform: ['Windows'] },
            { name: 'Disk Utility (macOS內建)', type: 'free', platform: ['macOS'] }
          ],
          tutorialLink: '/tutorials/filesystem-repair'
        }
      },
      {
        label: '已經點了格式化',
        value: 'already-formatted',
        nextQuestion: 'q3'
      }
    ]
  },
  {
    id: 'q6',
    text: '檔案是什麼類型？',
    options: [
      {
        label: '照片/圖片',
        value: 'photos',
        result: {
          problemType: 'photo-corrupted',
          title: '照片檔案損壞',
          severity: 'medium',
          successRate: 75,
          immediateActions: [
            '嘗試用不同軟體開啟',
            '使用圖片修復工具',
            '如果是 RAW 格式，使用專業工具'
          ],
          recommendedTools: [
            { name: 'Stellar Photo Repair', type: 'paid', platform: ['Windows', 'macOS'] },
            { name: 'JPEG Recovery LAB', type: 'paid', platform: ['Windows'] },
            { name: 'PhotoRec（救援）', type: 'free', platform: ['Windows', 'macOS', 'Linux'] }
          ],
          tutorialLink: '/tutorials/photo-repair'
        }
      },
      {
        label: '影片',
        value: 'videos',
        result: {
          problemType: 'video-corrupted',
          title: '影片檔案損壞',
          severity: 'medium',
          successRate: 65,
          immediateActions: [
            '使用 VLC 播放器嘗試播放（可修復部分問題）',
            '使用 FFmpeg 重建索引',
            '專業影片修復工具'
          ],
          recommendedTools: [
            { name: 'VLC Media Player', type: 'free', platform: ['Windows', 'macOS', 'Linux'] },
            { name: 'Stellar Video Repair', type: 'paid', platform: ['Windows', 'macOS'] },
            { name: 'Video Repair Tool', type: 'paid', platform: ['Windows'] }
          ],
          tutorialLink: '/tutorials/video-repair'
        }
      },
      {
        label: '文件檔案',
        value: 'documents',
        result: {
          problemType: 'document-corrupted',
          title: '文件檔案損壞',
          severity: 'medium',
          successRate: 70,
          immediateActions: [
            '使用對應軟體的內建修復功能',
            '嘗試用線上轉換工具',
            '使用專業檔案修復工具'
          ],
          recommendedTools: [
            { name: 'Word/Excel 內建修復', type: 'free', platform: ['Windows', 'macOS'] },
            { name: 'Stellar File Repair', type: 'paid', platform: ['Windows', 'macOS'] }
          ],
          tutorialLink: '/tutorials/document-repair'
        }
      }
    ]
  }
];

export default function DiagnoseTool() {
  const [currentQuestionId, setCurrentQuestionId] = useState('q1');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const currentQuestion = questions.find(q => q.id === currentQuestionId);

  const handleAnswer = (option: any) => {
    setHistory([...history, currentQuestionId]);

    if (option.result) {
      setResult(option.result);
    } else if (option.nextQuestion) {
      setCurrentQuestionId(option.nextQuestion);
    }
  };

  const handleReset = () => {
    setCurrentQuestionId('q1');
    setResult(null);
    setHistory([]);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previousQuestion = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentQuestionId(previousQuestion);
      setResult(null);
    }
  };

  if (result) {
    const severityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    const successRateColor = result.successRate >= 80 ? 'text-green-600' : 
                              result.successRate >= 60 ? 'text-yellow-600' : 
                              'text-red-600';

    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">診斷結果</h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">{result.title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityColors[result.severity]}`}>
              {result.severity === 'low' ? '輕度' : result.severity === 'medium' ? '中度' : '嚴重'}
            </span>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${successRateColor} mb-2`}>
                {result.successRate}%
              </div>
              <div className="text-gray-600">預估救援成功率</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-bold text-lg mb-3">⚡ 立即行動</h4>
          <ul className="space-y-2">
            {result.immediateActions.map((action, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-bold text-lg mb-3">🛠️ 推薦工具</h4>
          <div className="space-y-3">
            {result.recommendedTools.map((tool, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{tool.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${tool.type === 'free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {tool.type === 'free' ? '免費' : '付費'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  平台: {tool.platform.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <a 
            href={result.tutorialLink}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-blue-700"
          >
            查看詳細教學 →
          </a>
          <button
            onClick={handleReset}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            重新診斷
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>找不到問題</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">問題診斷</h2>
          {history.length > 0 && (
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← 上一步
            </button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(history.length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6">{currentQuestion.text}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="text-gray-500 hover:text-gray-700"
      >
        重新開始
      </button>
    </div>
  );
}
