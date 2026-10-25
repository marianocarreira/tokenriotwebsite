# Gameplay captures

Two 14-second MP4s, 960×540 at 30 fps, H.264 video / AAC audio, fast-start enabled.
Captured with the actual MissionBayGame simulation, drawMission renderer, original sprite sheets and stage art; scripted directional, shooting and avoidance inputs. No changes to game mechanics. Each capture contains 59 player shots and 11 enemy defeats on Hard. Music is the corresponding existing stage track.

Reproduction script in the game checkout: qa/capture-gameplay.mjs. It uses @napi-rs/canvas and ffmpeg-static in an ignored local tools directory. Posters are real captured frames. Both videos passed full FFmpeg decoding and browser playback checks.

The landing page loads video only on request, exposes native playback controls and pauses the other clip when one starts.
