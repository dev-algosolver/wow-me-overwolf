import { AppWindow } from "../AppWindow";
import {
  OWGamesEvents,
  OWHotkeys
} from "@overwolf/overwolf-api-ts";
import { interestingFeatures, hotkeys, windowNames, wowClassId } from "../consts";
import WindowState = overwolf.windows.WindowStateEx;

import { getCurrentWindow, dragResize } from '../services/overwolf.service';
import TalentPicker from '../utils/talentPicker';

// The window displayed in-game while a WOW game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up Ctrl+F as the minimize/restore hotkey.
// Like the background window, it also implements the Singleton design pattern.
class InGame extends AppWindow {
  private static _instance: InGame;
  private _wowGameEventsListener: OWGamesEvents;
  private _eventsLog: HTMLElement;
  private _infoLog: HTMLElement;
  private talentPicker: TalentPicker;

  private constructor() {
    super(windowNames.inGame);

    this._eventsLog = document.getElementById('eventsLog');
    this._infoLog = document.getElementById('infoLog');

    this.setToggleHotkeyBehavior();
    this.setToggleHotkeyText();

    this.initDragResize();

    this._wowGameEventsListener = new OWGamesEvents({
      onInfoUpdates: this.onInfoUpdates.bind(this),
      onNewEvents: this.onNewEvents.bind(this)
    },
      interestingFeatures);

    overwolf.settings.hotkeys.onChanged.addListener((e) => {
      this.setToggleHotkeyText();
    })

    // window.addEventListener('resize', this.setScale);
    // this.setScale(null);
    this.initWindowSizeAndPosition();

    this.talentPicker = new TalentPicker();
    this.talentPicker.initComponents();

    this.initOpacityRanger();
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new InGame();
    }

    return this._instance;
  }

  public run() {
    this._wowGameEventsListener.start();
  }

  private onInfoUpdates(info) {
    this.logLine(this._infoLog, info, false);
  }

  // Special events will be highlighted in the event log
  private onNewEvents(e) {
    const shouldHighlight = e.events.some(event => {
      switch (event.name) {
        case 'kill':
        case 'death':
        case 'assist':
        case 'level':
        case 'matchStart':
        case 'matchEnd':
          return true;
      }

      return false
    });
    this.logLine(this._eventsLog, e, shouldHighlight);
  }

  // Displays the toggle minimize/restore hotkey in the window header
  private async setToggleHotkeyText() {
    const hotkeyText = await OWHotkeys.getHotkeyText(hotkeys.toggle, wowClassId);
    const hotkeyElem = document.getElementById('hotkey');
    hotkeyElem.textContent = hotkeyText;
  }

  // Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = async (hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent): Promise<void> => {
      console.log(`pressed hotkey for ${hotkeyResult.name}`);
      const inGameState = await this.getWindowState();

      if (inGameState.window_state === WindowState.NORMAL ||
        inGameState.window_state === WindowState.MAXIMIZED) {
        this.currWindow.minimize();
      } else if (inGameState.window_state === WindowState.MINIMIZED ||
        inGameState.window_state === WindowState.CLOSED) {
        this.currWindow.restore();
      }
    }

    OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInGameWindow);
  }

  // Appends a new line to the specified log
  private logLine(log: HTMLElement, data, highlight) {
    console.log(data);
    if (!log) return;
    const line = document.createElement('pre');
    line.textContent = JSON.stringify(data);

    if (highlight) {
      line.className = 'highlight';
    }

    const shouldAutoScroll = (log.scrollTop + log.offsetHeight) > (log.scrollHeight - 10);

    log.appendChild(line);

    if (shouldAutoScroll) {
      log.scrollTop = log.scrollHeight;
    }
  }

  private initOpacityRanger() {
    const elRanger = document.getElementById('opacity-range');
    elRanger.addEventListener('input', (e) => {
      const value:number = parseInt((<HTMLInputElement>e.target).value);
      const body = document.getElementsByTagName('body')[0];
      body.style.opacity = (value / 100).toString();
    });
  }

  private initDragResize() {
    const elements = document.getElementsByClassName('resize');

    for (const el of elements) {
      el.addEventListener('mousedown', (e) => {
        const edge = el.getAttribute("edge");
        this.dragResize(<MouseEvent>e, edge);
      });
    }
  }

  private async dragResize(event: MouseEvent, edge) {
		if (this.maximized) {
			return;
		}

		console.log('doing drag resize', event, edge);
		// event.preventDefault();
		// event.stopPropagation();
		const window = await getCurrentWindow();
		dragResize(window.id, edge);
	}

  // private setScale(event) {
  //   console.log(window.innerWidth, window.innerHeight);
  //   const defaultWidth = 805;
  //   const defaultHeight = 800;
  //   const scaleX = (window.innerWidth - 30) / (defaultWidth - 30);
  //   const scaleY = (window.innerHeight - 40) / (defaultHeight - 40);
  //   const scale = Math.min(scaleX, scaleY);

  //   const element = document.getElementById('scale');
  //   element.style.transform = `scale(${scale})`;
  // }

  private initWindowSizeAndPosition() {
    overwolf.utils.getMonitorsList(result => {
      let _screenWidth = 0;
      let _screenHeight = 0;
      for (const display in result.displays) {
        if (result.displays[display].is_primary) {
          _screenWidth = result.displays[display].width;
          _screenHeight = result.displays[display].height;
        }
      }
      overwolf.windows.getCurrentWindow(res => {
        const _windowWidth = 805;
        const _windowHeight = Math.min(_screenHeight, 800);
        const _left = _screenWidth - _windowWidth;
        const _top = Math.round((_screenHeight - _windowHeight) / 2);
  
        overwolf.windows.changePosition(res.window.id, _left, _top, null);
        overwolf.windows.changeSize(res.window.id, _windowWidth, _windowHeight, null);
      })
    })
  }
}

InGame.instance().run();
