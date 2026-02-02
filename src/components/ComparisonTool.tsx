import { useState, useMemo } from 'react';

interface SDCard {
  id: string;
  brand: string;
  model: string;
  capacity: number;
  capacityUnit: string;
  type: string;
  speedClass: {
    uhs: string;
    video: string;
    app: string;
  };
  readSpeed: number;
  writeSpeed: number;
  price: number;
  currency: string;
  useCase: string[];
  warranty: string;
}

interface Props {
  cards: SDCard[];
}

export default function ComparisonTool({ cards }: Props) {
  // 篩選狀態
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minReadSpeed, setMinReadSpeed] = useState<number>(0);
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  
  // 排序狀態
  const [sortBy, setSortBy] = useState<'price' | 'readSpeed' | 'capacity'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // 比較狀態
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  // 取得所有品牌
  const allBrands = useMemo(() => {
    return Array.from(new Set(cards.map(card => card.brand)));
  }, [cards]);

  // 取得所有使用情境
  const allUseCases = useMemo(() => {
    const useCases = new Set<string>();
    cards.forEach(card => card.useCase.forEach(uc => useCases.add(uc)));
    return Array.from(useCases);
  }, [cards]);

  // 篩選與排序邏輯
  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards.filter(card => {
      // 品牌篩選
      if (selectedBrands.length > 0 && !selectedBrands.includes(card.brand)) {
        return false;
      }
      // 容量篩選
      if (card.capacity < minCapacity) {
        return false;
      }
      // 價格篩選
      if (card.price > maxPrice) {
        return false;
      }
      // 讀取速度篩選
      if (card.readSpeed < minReadSpeed) {
        return false;
      }
      // 使用情境篩選
      if (selectedUseCase && !card.useCase.includes(selectedUseCase)) {
        return false;
      }
      return true;
    });

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'readSpeed':
          comparison = a.readSpeed - b.readSpeed;
          break;
        case 'capacity':
          comparison = a.capacity - b.capacity;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [cards, selectedBrands, minCapacity, maxPrice, minReadSpeed, selectedUseCase, sortBy, sortOrder]);

  // 切換品牌選擇
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // 切換卡片選擇（用於比較）
  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else if (prev.length < 4) {
        return [...prev, cardId];
      }
      return prev;
    });
  };

  // 取得選中的卡片資料
  const cardsToCompare = cards.filter(card => selectedCards.includes(card.id));

  return (
    <div className="space-y-8">
      {/* 篩選區域 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">篩選條件</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 品牌篩選 */}
          <div>
            <label className="block font-semibold mb-2">品牌</label>
            <div className="space-y-2">
              {allBrands.map(brand => (
                <label key={brand} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 容量篩選 */}
          <div>
            <label className="block font-semibold mb-2">
              最小容量: {minCapacity} GB
            </label>
            <input
              type="range"
              min="0"
              max="512"
              step="32"
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0 GB</span>
              <span>512 GB</span>
            </div>
          </div>

          {/* 價格篩選 */}
          <div>
            <label className="block font-semibold mb-2">
              最高價格: NT$ {maxPrice}
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>NT$ 0</span>
              <span>NT$ 10,000</span>
            </div>
          </div>

          {/* 讀取速度篩選 */}
          <div>
            <label className="block font-semibold mb-2">
              最低讀取速度: {minReadSpeed} MB/s
            </label>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={minReadSpeed}
              onChange={(e) => setMinReadSpeed(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0 MB/s</span>
              <span>300 MB/s</span>
            </div>
          </div>

          {/* 使用情境篩選 */}
          <div>
            <label className="block font-semibold mb-2">使用情境</label>
            <select
              value={selectedUseCase}
              onChange={(e) => setSelectedUseCase(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">全部</option>
              {allUseCases.map(useCase => (
                <option key={useCase} value={useCase}>{useCase}</option>
              ))}
            </select>
          </div>

          {/* 排序 */}
          <div>
            <label className="block font-semibold mb-2">排序方式</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 border rounded px-3 py-2"
              >
                <option value="price">價格</option>
                <option value="readSpeed">讀取速度</option>
                <option value="capacity">容量</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* 重置按鈕 */}
        <button
          onClick={() => {
            setSelectedBrands([]);
            setMinCapacity(0);
            setMaxPrice(10000);
            setMinReadSpeed(0);
            setSelectedUseCase('');
          }}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          重置篩選
        </button>
      </div>

      {/* 結果統計 */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          找到 <span className="font-bold text-blue-600">{filteredAndSortedCards.length}</span> 張 SD 卡
        </p>
        {selectedCards.length > 0 && (
          <p className="text-gray-600">
            已選擇 <span className="font-bold text-blue-600">{selectedCards.length}</span> 張進行比較
            <button
              onClick={() => setSelectedCards([])}
              className="ml-2 text-red-600 hover:underline"
            >
              清除
            </button>
          </p>
        )}
      </div>

      {/* SD 卡列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCards.map((card) => (
          <div
            key={card.id}
            className={`border rounded-lg p-6 transition ${
              selectedCards.includes(card.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
            }`}
          >
            {/* 選擇框 */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold">
                {card.brand} {card.model}
              </h3>
              <input
                type="checkbox"
                checked={selectedCards.includes(card.id)}
                onChange={() => toggleCardSelection(card.id)}
                disabled={!selectedCards.includes(card.id) && selectedCards.length >= 4}
                className="mt-1"
              />
            </div>

            <div className="space-y-2 text-gray-600 mb-4">
              <p className="text-lg font-semibold">
                {card.capacity}{card.capacityUnit} - {card.type}
              </p>
              <p>讀取: <span className="font-semibold">{card.readSpeed} MB/s</span></p>
              <p>寫入: <span className="font-semibold">{card.writeSpeed} MB/s</span></p>
              <p className="text-sm">
                {card.speedClass.uhs} / {card.speedClass.video} / {card.speedClass.app}
              </p>
              <p className="text-sm">保固: {card.warranty}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {card.useCase.map(uc => (
                <span key={uc} className="px-2 py-1 bg-gray-200 rounded text-xs">
                  {uc}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-2xl font-bold text-blue-600">
                NT$ {card.price}
              </span>
              <a href={`/cards/${card.id}`} className="text-blue-600 hover:underline">
                詳情 →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 比較表格 */}
      {cardsToCompare.length > 1 && (
        <div className="bg-white border rounded-lg p-6 sticky bottom-0 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">規格比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">規格</th>
                  {cardsToCompare.map(card => (
                    <th key={card.id} className="text-left py-2 px-4">
                      {card.brand} {card.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">容量</td>
                  {cardsToCompare.map(card => (
                    <td key={card.id} className="py-2 px-4">
                      {card.capacity}{card.capacityUnit}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">讀取速度</td>
                  {cardsToCompare.map(card => (
                    <td key={card.id} className="py-2 px-4">
                      {card.readSpeed} MB/s
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">寫入速度</td>
                  {cardsToCompare.map(card => (
                    <td key={card.id} className="py-2 px-4">
                      {card.writeSpeed} MB/s
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">速度等級</td>
                  {cardsToCompare.map(card => (
                    <td key={card.id} className="py-2 px-4">
                      {card.speedClass.uhs} / {card.speedClass.video} / {card.speedClass.app}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">保固</td>
                  {cardsToCompare.map(card => (
                    <td key={card.id} className="py-2 px-4">
                      {card.warranty}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold">價格</td>
                  {cardsToCompare.map(card => (
                    <td key={card.id} className="py-2 px-4 text-lg font-bold text-blue-600">
                      NT$ {card.price}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
