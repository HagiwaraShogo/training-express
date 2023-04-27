/* Replace with your SQL commands */
CREATE TABLE `player_items` (
  `player_id` BIGINT(11) UNSIGNED NOT NULL COMMENT "プレイヤーID",
  `item_id` BIGINT(11) UNSIGNED NOT NULL COMMENT "アイテムID",
  `count` INT(11) UNSIGNED NOT NULL COMMENT "アイテム数",
  PRIMARY KEY (`player_id`, `item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;