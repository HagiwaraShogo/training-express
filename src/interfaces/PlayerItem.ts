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
  results: any,
  player: {
    monay: number,
    items: any
  }
}

  type PlayerItemKey = keyof PlayerItem;
  
  export { PlayerItem, PlayerItemKey, useItemResponse, useGachaResponse };