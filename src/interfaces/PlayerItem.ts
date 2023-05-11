interface PlayerItem {
  playerId?: number;
  itemId: number;
  count: number;
}

interface useItemResponse{
  itemId: number,
  count: number,
  player: {
    id: number,
    hp: number,
    mp: number
  }
}

interface useGachaResponse{
  itemId: number,
  name: string,
  count: number,
  totalCount: number
}

interface playerItemAllData {
  itemId?: number,
  name?: string,
  heal?: number,
  price?: number,
  percent?: number,
  count?: number
}

  type PlayerItemKey = keyof PlayerItem;
  
  export { PlayerItem, PlayerItemKey, useItemResponse, useGachaResponse, playerItemAllData };