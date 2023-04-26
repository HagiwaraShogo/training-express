interface PlayerItem {
    playerId?: number;
    itemId: number;
    count?: number;
  }

  type PlayerItemKey = keyof PlayerItem;
  
  export { PlayerItem, PlayerItemKey };