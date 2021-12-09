import { OWGamesEvents, OWHotkeys } from "@overwolf/overwolf-api-ts";
import { AppWindow } from "../AppWindow";
import {
  hotkeys,
  interestingFeatures,
  windowNames,
  wowClassId,
} from "../consts";
import { dragResize, getCurrentWindow } from "../services/overwolf.service";
import {
  deleteJournal,
  deleteJournalContent,
  editJournalContent,
  getCharacters,
  getJournals,
  getToken,
  setAuthToken,
  storeJournalContent,
  storeJournals,
  updateJournals,
} from "../utils/api";
import CharacterInfo from "../utils/characterInfo";
import TalentPicker from "../utils/talentPicker";
import WindowState = overwolf.windows.WindowStateEx;

// The window displayed in-game while a WOW game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up Ctrl+F as the minimize/restore hotkey.
// Like the background window, it also implements the Singleton design pattern.
const CLIENT_ID = "766b8aab7f3f4406a5d4844f5a0c6bd7";
const AUTHORIZE_ENDPOINT = "https://eu.battle.net/oauth/authorize";
// const redirectUri = 'http://localhost:3000/oauth/callback_overwolf';
const redirectUri = "https://wowme.gg/oauth/callback_overwolf";
const scope = ["wow.profile", "openid"];

const discordURL = "https://discord.gg/ryg9Czzr8Z";

class InGame extends AppWindow {
  private static _instance: InGame;
  private _wowGameEventsListener: OWGamesEvents;
  private _eventsLog: HTMLElement;
  private _infoLog: HTMLElement;
  private talentPicker: TalentPicker;
  private isLoggedIn: boolean = false;
  private battleTag: string;
  private battleId: string;
  private battleCred: {};
  private characters: [];
  private region: string;
  private characterInfo: CharacterInfo;

  private constructor() {
    super(windowNames.inGame);

    const token = localStorage.getItem("token");
    const expiresIn = localStorage.getItem("expiresIn");

    if (token && parseInt(expiresIn) > Date.now()) {
      this.battleTag = localStorage.getItem("battleTag");
      this.battleId = localStorage.getItem("battleId");
      this.region = localStorage.getItem("region");

      setAuthToken(token);
      this.getUserCharacterInfo();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("battleTag");
      localStorage.removeItem("battleId");
      localStorage.removeItem("region");
    }

    this.initButtonEvents();
    overwolf.extensions.onAppLaunchTriggered.addListener(this.callbackOAuth);

    this.talentPicker = new TalentPicker();
    this.talentPicker.initComponents();
    // this.initSettingsPanel();
    this.getUserJournals();
    this.storeUserJournals();
    this.updateUserJournals();
    this.storeUserJournalContent();
    this.updateUserJournalContent();
    this._eventsLog = document.getElementById("eventsLog");
    this._infoLog = document.getElementById("infoLog");

    this.setToggleHotkeyBehavior();
    this.setToggleHotkeyText();

    this.initDragResize();

    this._wowGameEventsListener = new OWGamesEvents(
      {
        onInfoUpdates: this.onInfoUpdates.bind(this),
        onNewEvents: this.onNewEvents.bind(this),
      },
      interestingFeatures
    );

    overwolf.settings.hotkeys.onChanged.addListener((e) => {
      this.setToggleHotkeyText();
    });

    // window.addEventListener('resize', this.setScale);
    // this.setScale(null);
    this.initWindowSizeAndPosition();

    this.talentPicker = new TalentPicker();
    this.talentPicker.initComponents();

    this.initOpacityRanger();
  }

  public setBattleTag(battleTag) {
    this.battleTag = battleTag;
  }

  public setBattleId(battleId) {
    this.battleId = battleId;
  }

  public setBattleCred(battleCred) {
    this.battleCred = battleCred;
  }

  public setCharacters(characters) {
    this.characters = characters;
  }

  public setRegion(region) {
    this.region = region;
  }

  private initButtonEvents() {
    this.activeScreen();
    const pjBtnLogin = document.getElementById(
      "btn-personal-journal-onLoggedin"
    );
    pjBtnLogin.classList.add("disabled");

    const loginButton2 = document.getElementById("btn-personal-journal");
    loginButton2.addEventListener("click", (e) => {
      const scopesString = encodeURIComponent(scope.join(" "));
      const redirectUriString = encodeURIComponent(redirectUri);
      const authorizeUrl = `${AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&scope=${scopesString}&redirect_uri=${redirectUriString}&response_type=code`;
      overwolf.utils.openUrlInDefaultBrowser(authorizeUrl);
    });
  }
  private activeScreen() {
    const personalJournalContent = document.querySelector(
      ".personal-journal-content"
    );
    const personalJournal = document.querySelector(".personal-journal");
    const talentPickerContent = document.querySelector(
      ".talent-picker-content"
    );
    const talentPicker = document.querySelector(".talent-picker");

    const menuItems = document.getElementsByClassName("menu-item");
    Array.from(menuItems).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        if (elem.classList.contains("work-in-progress")) {
          return;
        } else if (elem.id == "btn-personal-journal-onLoggedin") {
          console.log("Hello");

          personalJournalContent.classList.add("enabled");
          personalJournalContent.classList.remove("disabled");
          talentPickerContent.classList.remove("enabled");
          talentPickerContent.classList.add("disabled");

          return;
        } else {
          console.log("Not Hello");
          talentPickerContent.classList.add("enabled");
          talentPickerContent.classList.remove("disabled");
          personalJournalContent.classList.remove("enabled");
          personalJournalContent.classList.add("disabled");

          return;
        }
      });
    });
  }
  private async setCurrentHotkeyToInput() {
    const elInput = document.getElementById("hotkey-editor");
    const hotkeyText = await OWHotkeys.getHotkeyText(
      hotkeys.toggle,
      wowClassId
    );
    elInput.innerText = hotkeyText;
    return hotkeyText;
  }
  private initHotkeyInput() {
    this.setCurrentHotkeyToInput();

    const elInput = document.getElementById("hotkey-editor");
    const elClose = document.getElementById("hotkey-close");

    let keys = ["", "", "", ""];

    elInput.addEventListener("focus", (e) => {
      elInput.innerText = "Choose Key";
      keys = ["", "", "", ""];
    });

    elInput.addEventListener("focusout", (e) => {
      this.setCurrentHotkeyToInput();
    });

    elInput.addEventListener("keydown", (e) => {
      console.log("keydown", e.key, e.metaKey, e.shiftKey, e.altKey, e.ctrlKey);
      e.preventDefault();
      if (e.key === "Shift") {
        keys[2] = "Shift+";
      } else if (e.key === "Alt") {
        keys[0] = "Alt+";
      } else if (e.key === "Control") {
        keys[1] = "Ctrl+";
      } else {
        keys[3] = e.key;
        const newHotkey = {
          name: hotkeys.toggle,
          gameId: 765,
          virtualKey: e.keyCode,
          modifiers: {
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
          },
        };
        elClose.focus();
        overwolf.settings.hotkeys.assign(newHotkey, (e) => {
          console.log("assign: ", newHotkey, e);
          this.setCurrentHotkeyToInput();
        });
      }
      elInput.innerText = keys.join("");
    });

    elInput.addEventListener("keyup", (e) => {
      e.preventDefault();
      console.log("keyup", e.key, e.metaKey, e.shiftKey, e.altKey, e.ctrlKey);
      if (e.key === "Shift") {
        keys[2] = "";
      } else if (e.key === "Alt") {
        keys[0] = "";
      } else if (e.key === "Control") {
        keys[1] = "";
      }
      const strHotkey = keys.join("");
      elInput.innerText = strHotkey === "" ? "Choose Key" : strHotkey;
    });

    elClose.addEventListener("click", (e) => {
      const hotkey = {
        name: hotkeys.toggle,
        gameId: 765,
      };
      overwolf.settings.hotkeys.unassign(hotkey, (e) => {
        this.setCurrentHotkeyToInput();
      });
    });
  }
  private async getUserCharacterInfo() {
    const overlay = document.getElementById("loading-overlay");
    overlay.classList.add("active");

    const response = await getCharacters();

    this.region = response.region;
    this.characters = response.characters;
    console.log(this.characters);
    localStorage.setItem("region", this.region);
    this.onLoggedIn();

    overlay.classList.remove("active");
  }

  private async callbackOAuth(urlscheme) {
    const overlay = document.getElementById("loading-overlay");
    overlay.classList.add("active");

    const url = new URL(decodeURIComponent(urlscheme.parameter));
    const code = url.searchParams.get("code");

    try {
      const userInfo = await getToken({ code, isOverwolf: true });
      const token = userInfo.token;
      const expiresIn = Date.now() + userInfo.expiresIn * 1000;

      const inGame = InGame.instance();

      inGame.setBattleTag(userInfo.battleTag);
      inGame.setBattleId(userInfo.battleId);
      inGame.setBattleCred(userInfo.battleCred);
      inGame.setCharacters(userInfo.characters);
      inGame.setRegion(userInfo.region);

      localStorage.setItem("token", token);
      localStorage.setItem("expiresIn", expiresIn.toString());
      localStorage.setItem("battleTag", userInfo.battleTag);
      localStorage.setItem("battleId", userInfo.battleId);
      localStorage.setItem("battleCred", userInfo.battleCred);
      localStorage.setItem("region", userInfo.region);

      inGame.onLoggedIn();
      inGame.getUserJournals();
    } catch (e) {
      console.log(e);
    }

    overlay.classList.remove("active");
  }

  public clearJournalUI() {
    const oldJournalList = document.getElementById("journal-tabs");
    oldJournalList.innerHTML = "";
  }

  public onLoggedIn() {
    this.isLoggedIn = true;

    // const elBtnLogout = document.getElementById("btn-logout");
    // elBtnLogout.classList.add("enabled");

    const pjBtnLogin = document.getElementById(
      "btn-personal-journal-onLoggedin"
    );
    pjBtnLogin.classList.remove("disabled");
    pjBtnLogin.classList.add("enabled");

    const pjBtnLogout = document.getElementById("btn-personal-journal");
    pjBtnLogout.classList.add("disabled");
    pjBtnLogout.classList.remove("enabled");

    // this.drawUserInfo();
    // this.drawSubPanel();

    // this.getUserJournals();
  }

  private async getUserJournals() {
    let response = localStorage.getItem("battleId")
      ? await getJournals(this.battleId.toString())
      : null;
    const journalList = document.getElementById("journal-tabs");

    for (let i = 0; i < response?.data.length; i++) {
      console.log("loop started", i);
      const btn = document.createElement("div");
      btn.innerHTML = response.data[i].name;
      btn.setAttribute("data-id", response.data[i]._id);
      btn.classList.add("tab-link");
      let deleteSpan = document.createElement("span");
      deleteSpan.classList.add("material-icons");
      deleteSpan.classList.add("textSpan2");
      deleteSpan.innerHTML = "delete";
      journalList.appendChild(btn);
      btn.appendChild(deleteSpan);

      var editJournel = document.createElement("span");
      editJournel.classList.add("material-icons");
      editJournel.classList.add("editSpan2");
      editJournel.innerHTML = "edit";
      btn.appendChild(editJournel);

      editJournel.addEventListener("click", (e) => {
        const target = e.target as Element;
        e.stopPropagation();
        let elems = document.querySelector(".edit-journel");
        if (elems !== null) {
          elems.classList.remove("edit-journel");
        }
        target.parentElement.classList.add("edit-journel");
        const editModalOpenButton = document.getElementById("myBtnEdit");
        editModalOpenButton.click();
        console.log("clicked", response.data[i].name);
        (document.getElementById("myInput2") as HTMLInputElement).value =
          response.data[i].name;
        console.log("object", response.data[i]);
        const cb = document.getElementById("accept") as HTMLInputElement;
        cb.value = response.data[i].template;
      });

      deleteSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteJournal(response.data[i]._id);
        this.clearJournalUI();
        // const oldJournalList = document.getElementById('journal-tabs');
        // oldJournalList.innerHTML = '';
        response.data = [];
        this.getUserJournals();

        const journalContainer = document.getElementById(
          "journal-item-container"
        );
        journalContainer.innerHTML = "";
      });

      btn.addEventListener("click", function (e) {
        const target = e.target as Element;
        const id = this.getAttribute("data-id");
        let elems = document.querySelector(".active-tab");
        if (elems !== null) {
          elems.classList.remove("active-tab");
        }
        target.classList.add("active-tab");
        const selectedJournal = response.data[i];
        console.log("response data", response.data);
        console.log(i, selectedJournal);
        const journalContainer = document.getElementById(
          "journal-item-container"
        );

        journalContainer.innerHTML = "";
        selectedJournal.data.forEach((element) => {
          const journalItem = document.createElement("div");
          journalItem.setAttribute("data-id", element._id);
          journalItem.classList.add("journal-item");
          const journalBtn = document.createElement("div");
          journalBtn.innerHTML = element.title;
          var textSpan = document.createElement("span");
          textSpan.classList.add("material-icons");
          textSpan.classList.add("textSpan");
          textSpan.innerHTML = "delete";
          journalBtn.appendChild(textSpan);
          const journalDesc = document.createElement("p");

          var editSpan = document.createElement("span");
          editSpan.classList.add("material-icons");
          editSpan.classList.add("editSpan");
          editSpan.innerHTML = "edit";
          journalBtn.appendChild(editSpan);

          journalBtn.classList.add("accordion");
          if (journalDesc.classList.contains("active")) {
            journalDesc.classList.remove("active");
            journalDesc.innerHTML = "";
          } else {
            journalDesc.innerHTML = element.description;
            journalDesc.classList.add("active");
          }

          journalBtn.addEventListener("click", function () {
            if (journalDesc.classList.contains("active")) {
              journalDesc.classList.remove("active");
              journalDesc.innerHTML = "";
            } else {
              journalDesc.innerHTML = element.description;
              journalDesc.classList.add("active");
            }
          });

          editSpan.addEventListener("click", (e) => {
            const target = e.target as Element;
            // e.stopPropagation();
            let elems = document.querySelector(".active-content");
            if (elems !== null) {
              elems.classList.remove("active-content");
            }
            target.parentElement.parentElement.classList.add("active-content");
            const modalOpenButton =
              document.getElementById("editContentButton");
            modalOpenButton.click();
            (
              document.getElementById("editContentTitle") as HTMLInputElement
            ).value = element.title;
            document.querySelector(".editEditor").innerHTML =
              element.description;
          });

          textSpan.addEventListener("click", () => {
            let elems = document.querySelector(".active-tab");
            let dataID = elems.getAttribute("data-id");
            deleteJournalContent(dataID, element._id);
            let item = document.querySelector(`[data-id="${element._id}"]`);
            item.remove();
            let content = response.data[i].data;
            content = content.filter((con) => con._id != element._id);
            response.data[i].data = content;
          });
          journalItem.appendChild(journalBtn);
          if (element.description) {
            journalItem.appendChild(journalDesc);
          }
          journalContainer.appendChild(journalItem);
        });
      });
    }
  }

  private async storeUserJournals() {
    const saveButton = document.getElementById("saveButton");

    saveButton.addEventListener("click", async (e) => {
      e.preventDefault();
      let inputVal = (document.getElementById("myInput") as HTMLInputElement)
        .value;
      const cb = document.getElementById("accept") as HTMLInputElement;
      // const check = cb.checked
      const data = {
        battleId: this.battleId.toString(),
        name: inputVal,
        // template: check,
      };
      console.log(data);

      // console.log('this.battleId: ', this.battleId, typeof (this.battleId));
      // console.log('From Local Storage: ', localStorage.getItem("battleId"), typeof (localStorage.getItem("battleId")));

      const response = await storeJournals(data);
      if (response.success) {
        const journalList = document.getElementById("journal-tabs");
        journalList.innerHTML = "";
        await this.getUserJournals();
        let bttnn2 = document.querySelector(`[data-id="${response.data._id}"]`);
        if (bttnn2 as HTMLElement) {
          (bttnn2 as HTMLElement).click();
        }
        (document.getElementById("myInput") as HTMLInputElement).value = "";
        (document.querySelector(".close") as HTMLElement).click();
      }
    });
  }

  private async updateUserJournals() {
    const saveButtonEdit = document.getElementById("myModal2Save");

    saveButtonEdit.addEventListener("click", async (e) => {
      // console.log("from saveButton");
      e.preventDefault();
      let inputVal = (document.getElementById("myInput2") as HTMLInputElement)
        .value;
      const cb = document.getElementById("accept") as HTMLInputElement;
      // const check = cb.checked
      let content = document.querySelector(".edit-journel");
      const contentID = content.getAttribute("data-id");
      const data = {
        battleId: this.battleId.toString(),
        name: inputVal,
        // template: check,
      };
      const response = await updateJournals(contentID, data);
      if (response.success) {
        const journalList = document.getElementById("journal-tabs");
        journalList.innerHTML = "";
        await this.getUserJournals();
        let bttnn2 = document.querySelector(`[data-id="${response.data._id}"]`);
        if (bttnn2 as HTMLElement) {
          (bttnn2 as HTMLElement).click();
        }
        (document.getElementById("myInput2") as HTMLInputElement).value = "";
        (document.querySelector(".myModal2Close") as HTMLElement).click();
      }
    });
  }

  private async storeUserJournalContent() {
    const saveContentButton = document.getElementById("contentsaveButton");

    saveContentButton.addEventListener("click", async (e) => {
      e.preventDefault();
      let elems = document.querySelector(".active-tab");
      const id = elems.getAttribute("data-id");
      let contentTitle = (
        document.getElementById("contentTitle") as HTMLInputElement
      ).value;
      const htmlFile = document.querySelector(".editor").innerHTML;
      let data = {
        title: contentTitle,
        description: htmlFile,
      };
      const response = await storeJournalContent(id, data);
      if (response.success) {
        const journalList = document.getElementById("journal-tabs");
        journalList.innerHTML = "";
        await this.getUserJournals();
        let bttnn = document.querySelector(`[data-id="${id}"]`);
        if (bttnn as HTMLElement) {
          (bttnn as HTMLElement).click();
        }
        (document.getElementById("contentTitle") as HTMLInputElement).value =
          "";
        document.querySelector(".editor").innerHTML = "";
      }
      (document.querySelector(".ContentModalClose") as HTMLElement).click();
    });
  }

  private async updateUserJournalContent() {
    const saveContentButton2 = document.getElementById("contentsaveButton2");

    saveContentButton2.addEventListener("click", async (e) => {
      e.preventDefault();
      let elems = document.querySelector(".active-tab");
      const id = elems.getAttribute("data-id");
      let content = document.querySelector(".active-content");
      const contentID = content.getAttribute("data-id");
      let contentTitle = (
        document.getElementById("editContentTitle") as HTMLInputElement
      ).value;
      const htmlFile = document.querySelector(".editEditor").innerHTML;
      let data = {
        title: contentTitle,
        description: htmlFile,
      };
      const response = await editJournalContent(id, contentID, data);
      if (response.success) {
        const journalList = document.getElementById("journal-tabs");
        journalList.innerHTML = "";
        await this.getUserJournals();
        let bttnn = document.querySelector(`[data-id="${id}"]`);
        if (bttnn as HTMLElement) {
          (bttnn as HTMLElement).click();
        }
        (
          document.getElementById("editContentTitle") as HTMLInputElement
        ).value = "";
        document.querySelector(".editEditor").innerHTML = "";
      }
      (document.querySelector(".editContentModalClose") as HTMLElement).click();
    });
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
    const shouldHighlight = e.events.some((event) => {
      switch (event.name) {
        case "kill":
        case "death":
        case "assist":
        case "level":
        case "matchStart":
        case "matchEnd":
          return true;
      }

      return false;
    });
    this.logLine(this._eventsLog, e, shouldHighlight);
  }

  // Displays the toggle minimize/restore hotkey in the window header
  private async setToggleHotkeyText() {
    const hotkeyText = await OWHotkeys.getHotkeyText(
      hotkeys.toggle,
      wowClassId
    );
    const hotkeyElem = document.getElementById("hotkey");
    hotkeyElem.textContent = hotkeyText;
  }

  // Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = async (
      hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
    ): Promise<void> => {
      console.log(`pressed hotkey for ${hotkeyResult.name}`);
      const inGameState = await this.getWindowState();

      if (
        inGameState.window_state === WindowState.NORMAL ||
        inGameState.window_state === WindowState.MAXIMIZED
      ) {
        this.currWindow.minimize();
      } else if (
        inGameState.window_state === WindowState.MINIMIZED ||
        inGameState.window_state === WindowState.CLOSED
      ) {
        this.currWindow.restore();
      }
    };

    OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInGameWindow);
  }

  // Appends a new line to the specified log
  private logLine(log: HTMLElement, data, highlight) {
    console.log(data);
    if (!log) return;
    const line = document.createElement("pre");
    line.textContent = JSON.stringify(data);

    if (highlight) {
      line.className = "highlight";
    }

    const shouldAutoScroll =
      log.scrollTop + log.offsetHeight > log.scrollHeight - 10;

    log.appendChild(line);

    if (shouldAutoScroll) {
      log.scrollTop = log.scrollHeight;
    }
  }

  private initOpacityRanger() {
    const elRanger = document.getElementById("opacity-range");
    elRanger.addEventListener("input", (e) => {
      const value: number = parseInt((<HTMLInputElement>e.target).value);
      const body = document.getElementsByTagName("body")[0];
      body.style.opacity = (value / 100).toString();
    });
  }

  private initDragResize() {
    const elements = document.getElementsByClassName("resize");

    for (const el of elements) {
      el.addEventListener("mousedown", (e) => {
        const edge = el.getAttribute("edge");
        this.dragResize(<MouseEvent>e, edge);
      });
    }
  }

  private async dragResize(event: MouseEvent, edge) {
    if (this.maximized) {
      return;
    }

    console.log("doing drag resize", event, edge);
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
    overwolf.utils.getMonitorsList((result) => {
      let _screenWidth = 0;
      let _screenHeight = 0;
      for (const display in result.displays) {
        if (result.displays[display].is_primary) {
          _screenWidth = result.displays[display].width;
          _screenHeight = result.displays[display].height;
        }
      }
      overwolf.windows.getCurrentWindow((res) => {
        const _windowWidth = 805;
        const _windowHeight = Math.min(_screenHeight, 800);
        const _left = _screenWidth - _windowWidth;
        const _top = Math.round((_screenHeight - _windowHeight) / 2);

        overwolf.windows.changePosition(res.window.id, _left, _top, null);
        overwolf.windows.changeSize(
          res.window.id,
          _windowWidth,
          _windowHeight,
          null
        );
      });
    });
  }
}

InGame.instance().run();
