interface Player {
    id?: number;
    name?: string;
    hp?: number;
    mp?: number;
    money?: number;
  }

  type PlayerKey = keyof Player;
  
  export { Player, PlayerKey };