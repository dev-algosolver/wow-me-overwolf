import { AppWindow } from "../AppWindow";
import { OWHotkeys } from "@overwolf/overwolf-api-ts";
import { hotkeys, windowNames, wowClassId } from "../consts";

import {
  setAuthToken,
  getToken,
  getCharacters,
  getJournals,
  storeJournals,
  updateJournals,
  storeJournalContent,
  deleteJournalContent,
  editJournalContent,
  deleteJournal
} from "../utils/api";
import CharacterInfo from "../utils/characterInfo";
import TalentPicker from "../utils/talentPicker";

// The desktop window is the window displayed while Fortnite is not running.
// In our case, our desktop window has no logic - it only displays static data.
// Therefore, only the generic AppWindow class is called.

const CLIENT_ID = "766b8aab7f3f4406a5d4844f5a0c6bd7";
const AUTHORIZE_ENDPOINT = "https://eu.battle.net/oauth/authorize";
// const redirectUri = 'http://localhost:3000/oauth/callback_overwolf';
const redirectUri = "https://wowme.gg/oauth/callback_overwolf";
const scope = ["wow.profile", "openid"];

const discordURL = "https://discord.gg/ryg9Czzr8Z";

class Desktop extends AppWindow {
  private static _instance: Desktop;
  private isLoggedIn: boolean = false;
  private battleTag: string;
  private characters: [];
  private region: string;
  private characterInfo: CharacterInfo;
  private talentPicker: TalentPicker;

  private constructor() {
    super(windowNames.desktop);

    const token = localStorage.getItem("token");
    const expiresIn = localStorage.getItem("expiresIn");

    if (token && parseInt(expiresIn) > Date.now()) {
      this.battleTag = localStorage.getItem("battleTag");
      this.region = localStorage.getItem("region");

      setAuthToken(token);
      this.getUserCharacterInfo();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("battleTag");
      localStorage.removeItem("region");
    }

    this.initButtonEvents();
    overwolf.extensions.onAppLaunchTriggered.addListener(this.callbackOAuth);

    this.talentPicker = new TalentPicker();
    this.talentPicker.initComponents();
    this.initSettingsPanel();
    this.getUserJournals();
    this.storeUserJournals();
    this.updateUserJournals();
    this.storeUserJournalContent();
    this.updateUserJournalContent();
  }

  public setBattleTag(battleTag) {
    this.battleTag = battleTag;
  }

  public setCharacters(characters) {
    this.characters = characters;
  }

  public setRegion(region) {
    this.region = region;
  }

  private initButtonEvents() {
    // Login
    const loginButton = document.getElementById("btn-login");
    loginButton.addEventListener("click", (e) => {
      const scopesString = encodeURIComponent(scope.join(" "));
      const redirectUriString = encodeURIComponent(redirectUri);
      const authorizeUrl = `${AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&scope=${scopesString}&redirect_uri=${redirectUriString}&response_type=code`;
      overwolf.utils.openUrlInDefaultBrowser(authorizeUrl);
    });

    // Main Menu
    const menuItems = document.getElementsByClassName("menu-item");
    Array.from(menuItems).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        if (elem.classList.contains("in-progress")) {
          return;
        } else if (elem.id === "btn-logout") {
          this.isLoggedIn = false;
          localStorage.removeItem("expiresIn");
          localStorage.removeItem("battleTag");
          localStorage.removeItem("token");
          localStorage.removeItem("region");

          elem.classList.remove("enabled");

          this.drawUserInfo();
          this.drawSubPanel();

          return;
        }
        Array.from(menuItems).forEach((elem1) => {
          elem1.classList.remove("active");
        });
        elem.classList.add("active");

        const elMain = document.getElementById("main");
        elMain.className = elem.getAttribute("page-type");
      });
    });

    // Discord
    const discordButton = document.getElementById("discordButton");
    discordButton.addEventListener("click", (e) => {
      overwolf.utils.openUrlInDefaultBrowser(discordURL);
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

  private initSettingsPanel() {
    this.initHotkeyInput();

    const btnCopy = document.getElementById("btn-copy-social-url");
    btnCopy.addEventListener("click", (e) => {
      const elSocialUrl = <HTMLInputElement>(
        document.getElementById("input-social-url")
      );
      elSocialUrl.focus();
      elSocialUrl.select();
      document.execCommand("copy");
      elSocialUrl.selectionStart = 0;
      elSocialUrl.selectionEnd = 0;
      btnCopy.focus();
      btnCopy.classList.remove("copied");
      void btnCopy.offsetWidth;
      btnCopy.classList.add("copied");
    });

    const elSwitchGameStart = document.getElementById(
      "auto-launch-when-game-starts"
    );
    let switchValueGameStart = localStorage.getItem(
      "auto-launch-when-game-starts"
    );
    if (switchValueGameStart !== "false") {
      switchValueGameStart = "true";
      localStorage.setItem(
        "auto-launch-when-game-starts",
        switchValueGameStart
      );
      elSwitchGameStart.setAttribute("data", "Yes");
    }
    elSwitchGameStart.addEventListener("click", (e) => {
      switchValueGameStart = localStorage.getItem(
        "auto-launch-when-game-starts"
      );
      if (switchValueGameStart === "true") {
        switchValueGameStart = "false";
        elSwitchGameStart.setAttribute("data", "");
      } else {
        switchValueGameStart = "true";
        elSwitchGameStart.setAttribute("data", "Yes");
      }
      localStorage.setItem(
        "auto-launch-when-game-starts",
        switchValueGameStart
      );
    });

    const elSwitchGameEnd = document.getElementById("show-app-when-game-ends");
    let switchValueGameEnd = localStorage.getItem("show-app-when-game-ends");
    if (switchValueGameEnd !== "false") {
      switchValueGameEnd = "true";
      localStorage.setItem("show-app-when-game-ends", switchValueGameEnd);
      elSwitchGameEnd.setAttribute("data", "Yes");
    }
    elSwitchGameEnd.addEventListener("click", (e) => {
      switchValueGameEnd = localStorage.getItem("show-app-when-game-ends");
      if (switchValueGameEnd === "true") {
        switchValueGameEnd = "false";
        elSwitchGameEnd.setAttribute("data", "");
      } else {
        switchValueGameEnd = "true";
        elSwitchGameEnd.setAttribute("data", "Yes");
      }
      localStorage.setItem("show-app-when-game-ends", switchValueGameEnd);
    });
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

      const desktop = Desktop.instance();

      desktop.setBattleTag(userInfo.battleTag);
      desktop.setCharacters(userInfo.characters);
      desktop.setRegion(userInfo.region);

      localStorage.setItem("token", token);
      localStorage.setItem("expiresIn", expiresIn.toString());
      localStorage.setItem("battleTag", userInfo.battleTag);
      localStorage.setItem("region", userInfo.region);

      desktop.onLoggedIn();
    } catch (e) {
      console.log(e);
    }

    overlay.classList.remove("active");
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

  private async getUserJournals() {
    const response = await getJournals();
    const journalList = document.getElementById("journal-tabs");

    for (let i = 0; i < response.data.length; i++) {
      const btn = document.createElement("div");
      btn.innerHTML = response.data[i].name;
      btn.setAttribute("data-id", response.data[i]._id);
      btn.classList.add("tab-link");
      let deleteSpan = document.createElement("span");
      deleteSpan.classList.add("material-icons")
      deleteSpan.classList.add("textSpan2")
      deleteSpan.innerHTML = "delete"
      journalList.appendChild(btn);
      btn.appendChild(deleteSpan)


      var editJournel = document.createElement("span");
      editJournel.classList.add("material-icons")
      editJournel.classList.add("editSpan2")
      editJournel.innerHTML = "edit"
      btn.appendChild(editJournel)

      editJournel.addEventListener("click" ,(e)=>{
        const target = e.target as Element;
        e.stopPropagation();
        let elems = document.querySelector(".edit-journel");
        if(elems !==null){
        elems.classList.remove("edit-journel");
        }
        target.parentElement.classList.add("edit-journel");
        const editModalOpenButton = document.getElementById("myBtnEdit");
        editModalOpenButton.click();
        console.log("clicked", response.data[i].name);
        (document.getElementById("myInput2") as HTMLInputElement).value = response.data[i].name;
        console.log("object", response.data[i])
        const cb = document.getElementById("accept") as HTMLInputElement;
        cb.value = response.data[i].template
      })


      deleteSpan.addEventListener("click" ,(e)=>{
        e.stopPropagation();
        deleteJournal(response.data[i]._id);
        let item = document.querySelector(`[data-id="${response.data[i]._id}"]`);
        item.remove();
        let content = response.data;
        content = content.filter((con) => con._id != response.data[i]._id );
        response.data = content;
        const journalContainer = document.getElementById(
          "journal-item-container"
        );
        journalContainer.innerHTML = "";
      });

      btn.addEventListener("click", function (e) {
        const target = e.target as Element;
        const id = this.getAttribute("data-id");
        let elems = document.querySelector(".active-tab");
        if(elems !==null){
        elems.classList.remove("active-tab");
        }
        target.classList.add("active-tab");
        const selectedJournal = response.data[i];
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
          textSpan.classList.add("material-icons")
          textSpan.classList.add("textSpan")
          textSpan.innerHTML = "delete"
          journalBtn.appendChild(textSpan)
          const journalDesc = document.createElement("p");


          var editSpan = document.createElement("span");
          editSpan.classList.add("material-icons")
          editSpan.classList.add("editSpan")
          editSpan.innerHTML = "edit"
          journalBtn.appendChild(editSpan)

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

          editSpan.addEventListener("click" ,(e)=>{
            const target = e.target as Element;
            // e.stopPropagation();
            let elems = document.querySelector(".active-content");
            if(elems !==null){
            elems.classList.remove("active-content");
            }
            target.parentElement.parentElement.classList.add("active-content");
            const modalOpenButton = document.getElementById("editContentButton");
            modalOpenButton.click();
            (document.getElementById("editContentTitle") as HTMLInputElement).value= element.title;
            document.querySelector(".editEditor").innerHTML = element.description;
          })
          
          textSpan.addEventListener("click" ,()=>{
            let elems = document.querySelector(".active-tab");
            let dataID = elems.getAttribute('data-id')
            deleteJournalContent(dataID , element._id);
            let item = document.querySelector(`[data-id="${element._id}"]`);
            item.remove();
            let content = response.data[i].data;
            content = content.filter((con) => con._id != element._id );
            response.data[i].data = content;
          })
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
    const saveButton = document.getElementById("saveButton")
    
    saveButton.addEventListener("click" , async (e)=>{
      e.preventDefault();
      let inputVal = (document.getElementById("myInput") as HTMLInputElement).value;
      const cb = document.getElementById("accept") as HTMLInputElement;
      const check = cb.checked
      const data = {
        battleId: "a232df3dfafa213",
        name: inputVal,
        template: check,
      }
      console.log(data)
      const response = await storeJournals(data);
      if(response.success){
        const journalList = document.getElementById("journal-tabs");
        journalList.innerHTML= '';
        await this.getUserJournals();  
        let bttnn2 = document.querySelector(`[data-id="${response.data._id}"]`);
        if((bttnn2 as HTMLElement)){
          (bttnn2 as HTMLElement).click()
        }
        (document.getElementById("myInput") as HTMLInputElement).value = "";
        (document.querySelector(".close") as HTMLElement).click()
      }
    })
  }


  private async updateUserJournals() {
    const saveButtonEdit = document.getElementById("myModal2Save")
    
    saveButtonEdit.addEventListener("click" , async (e)=>{
      e.preventDefault();
      let inputVal = (document.getElementById("myInput2") as HTMLInputElement).value;
      const cb = document.getElementById("accept") as HTMLInputElement;
      const check = cb.checked
      let content = document.querySelector(".edit-journel");
      const contentID = content.getAttribute("data-id")
      const data = {
        battleId: "a232df3dfafa213",
        name: inputVal,
        template: check,
      }
      const response = await updateJournals(contentID, data);
      if(response.success){
        const journalList = document.getElementById("journal-tabs");
        journalList.innerHTML= '';
        await this.getUserJournals();  
        let bttnn2 = document.querySelector(`[data-id="${response.data._id}"]`);
        if((bttnn2 as HTMLElement)){
          (bttnn2 as HTMLElement).click()
        }
        (document.getElementById("myInput2") as HTMLInputElement).value = "";
        (document.querySelector(".myModal2Close") as HTMLElement).click()
      }
    })
  }


  private async storeUserJournalContent() {
    const saveContentButton = document.getElementById("contentsaveButton")
    
    saveContentButton.addEventListener("click" , async (e)=>{
      e.preventDefault();
      let elems = document.querySelector(".active-tab");
      const id = elems.getAttribute("data-id")
      let contentTitle = (document.getElementById("contentTitle") as HTMLInputElement).value;
      const htmlFile = document.querySelector(".editor").innerHTML;
      let data = {
        title: contentTitle,
        description : htmlFile
      }
      const response = await storeJournalContent(id,data);
      if(response.success){
      const journalList = document.getElementById("journal-tabs");
      journalList.innerHTML= '';
      await this.getUserJournals()    
      let bttnn = document.querySelector(`[data-id="${id}"]`);
      if((bttnn as HTMLElement)){
        (bttnn as HTMLElement).click()
      }
      (document.getElementById("contentTitle") as HTMLInputElement).value= ""
       document.querySelector(".editor").innerHTML =""
      }
      (document.querySelector(".ContentModalClose") as HTMLElement).click()
    })
  }



  private async updateUserJournalContent() {
    const saveContentButton2 = document.getElementById("contentsaveButton2")
    
    saveContentButton2.addEventListener("click" , async (e)=>{
      e.preventDefault();
      let elems = document.querySelector(".active-tab");
      const id = elems.getAttribute("data-id")
      let content = document.querySelector(".active-content");
      const contentID = content.getAttribute("data-id")
      let contentTitle = (document.getElementById("editContentTitle") as HTMLInputElement).value;
      const htmlFile = document.querySelector(".editEditor").innerHTML;
      let data = {
        title: contentTitle,
        description : htmlFile
      }
      const response = await editJournalContent(id,contentID, data);
      if(response.success){
      const journalList = document.getElementById("journal-tabs");
      journalList.innerHTML= '';
      await this.getUserJournals()    
      let bttnn = document.querySelector(`[data-id="${id}"]`);
      if((bttnn as HTMLElement)){
        (bttnn as HTMLElement).click()
      }
      (document.getElementById("editContentTitle") as HTMLInputElement).value= ""
       document.querySelector(".editEditor").innerHTML =""
      }
      (document.querySelector(".editContentModalClose") as HTMLElement).click()
    })
  }

  public onLoggedIn() {
    this.isLoggedIn = true;

    const elBtnLogout = document.getElementById("btn-logout");
    elBtnLogout.classList.add("enabled");

    this.drawUserInfo();
    this.drawSubPanel();
  }

  private drawUserInfo() {
    const elUserInfo = document.getElementById("user-info");
    elUserInfo.classList.remove("active");
    if (this.isLoggedIn) {
      elUserInfo.classList.add("active");

      const elBattleTag = document.getElementById("battle-tag");
      elBattleTag.innerHTML = this.battleTag;
    }
  }

  private drawSubPanel() {
    const elSubPanel = document.getElementById("sub-panel");
    elSubPanel.classList.remove("logged-in");
    if (this.isLoggedIn) {
      elSubPanel.classList.add("logged-in");
      this.characterInfo = new CharacterInfo(this.characters);
      this.characterInfo.initDropdown();
    }
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new Desktop();
    }

    return this._instance;
  }
}

Desktop.instance();
