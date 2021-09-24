import { windowNames, wowClassId } from "../consts";
import {
  OWGames,
  OWGameListener,
  OWWindow
} from '@overwolf/overwolf-api-ts';
import RunningGameInfo = overwolf.games.RunningGameInfo;

// The background controller holds all of the app's background logic - hence its name. it has
// many possible use cases, for example sharing data between windows, or, in our case,
// managing which window is currently presented to the user. To that end, it holds a dictionary
// of the windows available in the app.
// Our background controller implements the Singleton design pattern, since only one
// instance of it should exist.
class BackgroundController {
  private static _instance: BackgroundController;
  private _windows = {};
  private _wowGameListener: OWGameListener;
  private _isRunByGameStart: boolean;

  private constructor() {
    // Populating the background controller's window dictionary
    this._windows[windowNames.desktop] = new OWWindow(windowNames.desktop);
    this._windows[windowNames.inGame] = new OWWindow(windowNames.inGame);

    // When a WOW game is started or is ended, toggle the app's windows
    this._wowGameListener = new OWGameListener({
      onGameStarted: this.onGameStarted.bind(this),
      onGameEnded: this.onGameEnded.bind(this)
    });

    this._isRunByGameStart = true;
  };

  // Implementing the Singleton design pattern
  public static instance(): BackgroundController {
    if (!BackgroundController._instance) {
      BackgroundController._instance = new BackgroundController();
    }

    return BackgroundController._instance;
  }

  // When running the app, start listening to games' status and decide which window should
  // be launched first, based on whether WOW is currently running
  public async run() {
    const currWindow = await this.isWOWRunning() ? windowNames.inGame : windowNames.desktop;
    console.log(currWindow)
    this._windows[currWindow].restore();
    if (currWindow === windowNames.inGame) {
      this._isRunByGameStart = false;
    }
    this._wowGameListener.start();
  }

  private onGameStarted(info) {
    if (!info || !this.isGameWOW(info)) {
      return;
    }

    if (!this._isRunByGameStart) {
      this._isRunByGameStart = true;
    } else {
      const autoLaunch = localStorage.getItem('auto-launch-when-game-starts');
      const mainWindow = new OWWindow('background');
  
      if (info.isRunning) {
        if (autoLaunch === 'false') {
          mainWindow.close();
        } else {
          this._windows[windowNames.desktop].close();
          this._windows[windowNames.inGame].restore();
        }
      }
    }
  }

  private onGameEnded(info) {
    if (!info || !this.isGameWOW(info)) {
      return;
    }

    const showApp = localStorage.getItem('show-app-when-game-ends');
    const mainWindow = new OWWindow('background');

    if (!info.isRunning) {
      if (showApp !== 'false') {
        this._windows[windowNames.inGame].close();
        this._windows[windowNames.desktop].restore();
      } else {
        mainWindow.close();
      }
    }
  }

  private async isWOWRunning(): Promise<boolean> {
    const info = await OWGames.getRunningGameInfo();

    return info && info.isRunning && this.isGameWOW(info);
  }

  // Identify whether the RunningGameInfo object we have references WOW
  private isGameWOW(info: RunningGameInfo) {
    return info.classId === wowClassId;
  }
}

BackgroundController.instance().run();
