export interface Leaderboard {
  stagename_text: string;
  threshold_number: number;
  scores_list_custom_score: string[];
}

export interface Score {
  _id: string;
  displayname_text: string;
  hitfactor_number: number;
  acerank_option_rank: string;
  timeinseconds_number: number;
}
