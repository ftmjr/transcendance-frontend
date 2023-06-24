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
  DigitAtlasJson = 'DigitAtlasJson',
}
// put all sprites according to the theme and return tuples of (key, path)

export function getPongSprites(theme: PongTheme): Record<PongSprite, string> {
  switch (theme) {
    case 'Soccer':
      return {
        [PongSprite.Background]: '/pong/backgrounds/arcade_bg_ia-min.png',
        [PongSprite.GameField]: '/pong/soccer/ground_grass.png',
        [PongSprite.FieldCenter]: '/pong/soccer/middle_line.png',
        [PongSprite.GoalLine]: '/pong/soccer/maillage.png',
        [PongSprite.Paddle]: '/pong/paddle.png',
        [PongSprite.AwayPaddle]: '/pong/paddle.png',
        [PongSprite.Ball]: '/pong/ball.png',
        [PongSprite.BallParticle]: '/pong/arcade/star_small.png',
        [PongSprite.WallSong]: '/pong/sounds/arcade_wall.mp3',
        [PongSprite.PaddleSong]: '/pong/sounds/arcade_paddle.mp3',
        [PongSprite.ScoreSong]: '/pong/sounds/arcade_score.mp3',
        [PongSprite.DigitAtlasSprites]: '/pong/soccer/digits.png',
        [PongSprite.DigitAtlasJson]: '/pong/soccer/digits.json',
      }
    case 'Arcade':
    default:
      return {
        [PongSprite.Background]: '/pong/backgrounds/arcade_bg_ia-min.png',
        [PongSprite.GameField]: '/pong/soccer/ground_grass.png',
        [PongSprite.FieldCenter]: '/pong/backgrounds/arcade_field_center.png',
        [PongSprite.GoalLine]: '/pong/soccer/maillage.png',
        [PongSprite.Paddle]: '/pong/paddle.png',
        [PongSprite.AwayPaddle]: '/pong/paddle.png',
        [PongSprite.Ball]: '/pong/ball.png',
        [PongSprite.BallParticle]: '/pong/arcade/star_small.png',
        [PongSprite.WallSong]: '/pong/sounds/arcade_wall.mp3',
        [PongSprite.PaddleSong]: '/pong/sounds/arcade_paddle.mp3',
        [PongSprite.ScoreSong]: '/pong/sounds/arcade_score.mp3',
        [PongSprite.DigitAtlasSprites]: '/pong/soccer/digits.png',
        [PongSprite.DigitAtlasJson]: '/pong/soccer/digits.json',
      }
  }
}
