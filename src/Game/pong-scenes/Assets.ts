export type PongTheme = 'Arcade' | 'Soccer'
export enum PongSprite {
  Background = 'Background',
  GameField = 'GameField',
  FieldCenter = 'FieldCenter',
  GoalLine = 'GoalLine',
  Paddle = 'Paddle',
  AwayPaddle = 'AwayPaddle',
  Ball = 'Ball',
  BallParticle = 'BallParticle',
  WallSong = 'WallSong',
  PaddleSong = 'PaddleSong',
  ScoreSong = 'ScoreSong',
  DigitAtlasSprites = 'DigitAtlas',
  DigitAtlasJson = 'DigitAtlasJson'
}
// put all sprites according to the theme and return tuples of (key, path)

export function getPongSprites(theme: PongTheme): Record<PongSprite, string> {
  switch (theme) {
    case 'Soccer':
      return {
        [PongSprite.Background]: '/pong/backgrounds/arcade_bg_ia-min.png',
        [PongSprite.GameField]: '/pong/soccer/ground_grass.png',
        [PongSprite.FieldCenter]: '/pong/soccer/center_round.png',
        [PongSprite.GoalLine]: '/pong/arcade/pattern_18.png',
        [PongSprite.Paddle]: '/pong/paddle.png',
        [PongSprite.AwayPaddle]: '/pong/paddle.png',
        [PongSprite.Ball]: '/pong/ball.png',
        [PongSprite.BallParticle]: '/pong/arcade/star_small.png',
        [PongSprite.WallSong]: '/audio/footstep_carpet_000.ogg',
        [PongSprite.PaddleSong]: '/audio/impactPunch_medium_001.ogg',
        [PongSprite.ScoreSong]: '/audio/confirmation_001.ogg',
        [PongSprite.DigitAtlasSprites]: '/pong/soccer/digits.png',
        [PongSprite.DigitAtlasJson]: '/pong/soccer/digits.json'
      }
    case 'Arcade':
    default:
      return {
        [PongSprite.Background]: '/pong/backgrounds/arcade_bg_ia-min.png',
        [PongSprite.GameField]: '/pong/arcade/back_blue.png',
        [PongSprite.FieldCenter]: '/pong/soccer/center_round.png',
        [PongSprite.GoalLine]: '/pong/arcade/pattern_18.png',
        [PongSprite.Paddle]: '/pong/paddle.png',
        [PongSprite.AwayPaddle]: '/pong/paddle.png',
        [PongSprite.Ball]: '/pong/ball.png',
        [PongSprite.BallParticle]: '/pong/arcade/star_small.png',
        [PongSprite.WallSong]: '/audio/footstep_carpet_000.ogg',
        [PongSprite.PaddleSong]: '/audio/click_005.ogg',
        [PongSprite.ScoreSong]: '/audio/confirmation_001.ogg',
        [PongSprite.DigitAtlasSprites]: '/pong/soccer/digits.png',
        [PongSprite.DigitAtlasJson]: '/pong/soccer/digits.json'
      }
  }
}
