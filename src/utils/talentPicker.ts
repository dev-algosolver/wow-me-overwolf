import { createCustomDropDown, DropDownItemInfo } from '../components/dropdown';
import { createTalentsTable } from '../components/talentsTable';

import { testClassList, testKeyLevelList, testRaidBossList, testDungeonList, testRaidList, testSpecsList, testTalentsInfo } from '../init/initData';

import { getSpecList, getDungeonList, getRaidList, getRaidBossList, getTalentTableInfo } from './api';

interface SearchCondition {
  class: string,
  specs: string,
  is_dungeon: boolean,
  raid_dungeon: string,
  key_level: string,
  raid_boss: string,
  key_stone_level_min: number,
  key_stone_level_max: number,
  advanced_filters: boolean,
  tree_mode: boolean
};

export default class TalentPicker {
  private searchCondition: SearchCondition;
  private famousTalentInfo: any;
  private selectedTalentTreeIndex: number;

  constructor() {
    this.searchCondition = {
      class: 'Demon Hunter',
      specs: 'Havoc',
      is_dungeon: true,
      raid_dungeon: 'Castle Nathria',
      key_level: 'Mythic',
      raid_boss: 'Shriekwing',
      key_stone_level_min: 1,
      key_stone_level_max: 45,
      advanced_filters: false,
      tree_mode: false
    }

    this.famousTalentInfo = testTalentsInfo;
  }

  public initComponents() {
    this.initDropdowns();
    this.initKeyStoneLevelRange();
    this.initSwitch();

    this.initTalentsTable(this.famousTalentInfo, 0);

    this.initInProgressEvent();
    this.initTreeModeActionPanelEvent();

    // this.drawTalentTable();
  }

  private initDropDownEventListner(name: string) {
    document.getElementsByName(name).forEach(elem => {
      elem.addEventListener("click", (e) => {
        this.searchCondition[name] = (<HTMLInputElement>e.target).value;
        
        if (name === 'class') {
          this.reloadSpecDropdown();
        } else if (name === 'raid_dungeon') {
          if (this.searchCondition.is_dungeon) {
            this.drawTalentTable();
          } else {
            this.reloadRaidBossDropdown();
          }
        } else {
          this.drawTalentTable();
        }
      });
    })
  }
  
  private initSelect(title: string, parent_id: string, dropdownList: DropDownItemInfo[], variableName: string) {
    const container = document.getElementById(parent_id);
    container.innerHTML = '';
  
    const elTitle = document.createElement('label');
    elTitle.innerText = title;
    container.appendChild(elTitle);
  
    const elDropdown = createCustomDropDown({
      variableName: variableName,
      dropDownList: dropdownList
    });
    container.appendChild(elDropdown);
  
    this.initDropDownEventListner(variableName);
    this.searchCondition[variableName] = dropdownList[0].text;
  }
  
  private initDropdowns() {
    this.initSelect("Class", "class-select-box__container", testClassList, 'class');
    this.initSelect("Specs", "specs-select-box__container", testSpecsList, 'specs');
    this.initSelect("Dungeon List", "raid_dungeon-select-box__container", testDungeonList, 'raid_dungeon');
    this.initSelect("Raid Level", "key_level-select-box__container", testKeyLevelList, 'key_level');
  }
  
  private async reloadSpecDropdown() {
    try {
      let specList = await getSpecList(this.searchCondition.class);
      specList = specList.length > 0 ? specList : testSpecsList;
      this.initSelect("Specs", "specs-select-box__container", specList, 'specs');
      this.searchCondition.specs = specList[0].text;
  
      const animPanel = document.getElementById('talent-anim-panel');
      animPanel.classList.remove('fadeIn');
      if (!animPanel.classList.contains('fadeOut')) {
        animPanel.classList.add('fadeOut');
      }
  
      this.drawTalentTable();
    } catch (e) {
      console.log(e);
    }
  }
  
  private async reloadRaidDungeonDropdown() {
    try {
      const animPanel = document.getElementById('talent-anim-panel');
      animPanel.classList.remove('fadeIn');
      if (!animPanel.classList.contains('fadeOut')) {
        animPanel.classList.add('fadeOut');
      }
  
      let raidDungeonList = [];
      if (this.searchCondition.is_dungeon) {
        raidDungeonList = await getDungeonList(this.searchCondition.key_stone_level_min, this.searchCondition.key_stone_level_max);
        raidDungeonList = raidDungeonList.length > 0 ? raidDungeonList : testDungeonList;
      } else {
        raidDungeonList = await getRaidList();
        raidDungeonList = raidDungeonList.length > 0 ? raidDungeonList : testRaidList;
      }
      this.initSelect(
        this.searchCondition.is_dungeon ? "Dungeon List" : "Raid List", 
        "raid_dungeon-select-box__container", 
        raidDungeonList, 
        'raid_dungeon'
      );
      this.searchCondition.raid_dungeon = raidDungeonList[0].text;
  
      if (this.searchCondition.is_dungeon) {
        this.drawTalentTable();
      } else {
        this.reloadRaidBossDropdown();
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  private async reloadRaidBossDropdown() {
    const animPanel = document.getElementById('talent-anim-panel');
    animPanel.classList.remove('fadeIn');
    if (!animPanel.classList.contains('fadeOut')) {
      animPanel.classList.add('fadeOut');
    }
  
    let raidBossList = await getRaidBossList(this.searchCondition.raid_dungeon);
    raidBossList = raidBossList.length > 0 ? raidBossList : testRaidBossList;
  
    this.initSelect("Raid Boss", "raid_boss-select-box__container",  raidBossList, 'raid_boss');
    this.searchCondition.raid_boss = raidBossList[0].text;
  
    this.drawTalentTable();
  }
  
  private async drawTalentTable(noAnim?: boolean) {
    try {
      const animPanel = document.getElementById('talent-anim-panel');
      if (!noAnim && !animPanel.classList.contains('fadeOut')) {
        animPanel.classList.add('fadeOut');
      }
  
      const response = await getTalentTableInfo({
        class_name: this.searchCondition.class, 
        spec: this.searchCondition.specs,
        type: this.searchCondition.is_dungeon ? 'dungeon' : 'raid',
        raid_dungeon: this.searchCondition.raid_dungeon, 
        raid_boss: this.searchCondition.raid_boss,
        raid_level: this.searchCondition.key_level,
        dungeon_min_level: this.searchCondition.key_stone_level_min,
        dungeon_max_level: this.searchCondition.key_stone_level_max,
        tree_mode: this.searchCondition.tree_mode ? 'tree' : 'normal'
      });
  
      if (this.searchCondition.tree_mode) {
        this.famousTalentInfo = response.talentTableInfo.length > 0 ? response.talentTableInfo : [{pick_rate: 0, talent_tree: testTalentsInfo}];
        this.selectedTalentTreeIndex = 0;
        this.initTalentsTable(this.famousTalentInfo[0].talent_tree, response.logCount, 0, this.famousTalentInfo[0].pick_rate);
      } else {
        this.famousTalentInfo = response.talentTableInfo.length > 0 ? response.talentTableInfo : testTalentsInfo;
        this.initTalentsTable(this.famousTalentInfo, response.logCount);
      }
  
      if (!noAnim) {
        animPanel.classList.remove('fadeOut');
        animPanel.classList.add('fadeIn');
      }
  
    } catch (e) {
      console.log(e);
    }
  }
  
  private initKeyStoneLevelRange() {
    const elemMin = document.getElementById("key-stone-level-min");
    const elemMax = document.getElementById("key-stone-level-max");
    const elemText = document.getElementById("key-stone-level-text");
  
    (<HTMLInputElement>elemMin).value = `${this.searchCondition.key_stone_level_min}`;
    (<HTMLInputElement>elemMax).value = `${this.searchCondition.key_stone_level_max}`;
    elemText.innerText = `${this.searchCondition.key_stone_level_min} - ${this.searchCondition.key_stone_level_max}`;
  
    elemMin.addEventListener("input", (e) => {
      let value:number = parseInt((<HTMLInputElement>e.target).value);
      if (value >= this.searchCondition.key_stone_level_max) {
        value = this.searchCondition.key_stone_level_max - 1;
        (<HTMLInputElement>e.target).value = `${value}`;
      }
      this.searchCondition.key_stone_level_min = value;
      elemText.innerText = `${this.searchCondition.key_stone_level_min} - ${this.searchCondition.key_stone_level_max}`;
    });
  
    elemMin.addEventListener("mouseup", (e) => {
      this.drawTalentTable();
    });
  
    elemMax.addEventListener("input", (e) => {
      let value:number = parseInt((<HTMLInputElement>e.target).value);
      if (value <= this.searchCondition.key_stone_level_min) {
        value = this.searchCondition.key_stone_level_min + 1;
        (<HTMLInputElement>e.target).value = `${value}`;
      }
      this.searchCondition.key_stone_level_max = value;
      elemText.innerText = `${this.searchCondition.key_stone_level_min} - ${this.searchCondition.key_stone_level_max}`;
    });
  
    elemMax.addEventListener("mouseup", (e) => {
      this.drawTalentTable();
    });
  }
  
  private initTalentsTable(talentsInfo, logCount: number, tree_index?: number, pick_rate?: number) {
    const elTitle = document.getElementById("talent-panel-title");
    const elTreeActionPanel = document.getElementById("tree_mode_action_panel");
  
    if (this.searchCondition.tree_mode) {
      if (logCount > 0) {
        elTitle.innerText = `Most popular talent trees`;
      } else {
        elTitle.innerText = `We still don't have any runs scanned for this`;
      }
  
      const pickRate = document.getElementById("pick_rate");
      const treeIndex = document.getElementById("tree_index");
  
      if (!elTreeActionPanel.classList.contains('active')) {
        elTreeActionPanel.classList.add('active');
      }
  
      pickRate.innerText = `Pick Rate : ${pick_rate ? pick_rate : 0}%`;
      treeIndex.innerText = `${(tree_index ? tree_index : 0) + 1} / ${this.famousTalentInfo.length}`;
    } else {
      if (logCount > 0) {
        elTitle.innerText = `Most popular talent trees for ${this.searchCondition.specs} ${this.searchCondition.class} in ${this.searchCondition.raid_dungeon}`;
      } else {
        elTitle.innerText = `We still don't have any runs scanned for this`;
      }
      elTreeActionPanel.classList.remove('active');
    }
  
    const container = document.getElementById("talent-table-container");
    container.innerHTML = '';
    const talentsTable = createTalentsTable({ talentLevelList: talentsInfo }, this.searchCondition.tree_mode );
  
    container.appendChild(talentsTable);
  }
  
  private initInProgressEvent() {
    const elements = document.getElementsByClassName('work-in-progress');
    const messagePanel = document.getElementById('message');
  
    for (const el of elements) {
      el.addEventListener('click', (e) => {
        const message = el.getAttribute("message");
        messagePanel.innerHTML = `<div>${message}</div>`;
        messagePanel.classList.remove('open');
        void messagePanel.offsetWidth;
        messagePanel.classList.add('open');
      });
    }
  }
  
  private initTreeModeActionPanelEvent() {
    const elTreeMode = document.getElementById('tree_mode');
  
    elTreeMode.addEventListener('change', (e) => {
      if ((<HTMLInputElement>(e.target)).checked) {
        this.searchCondition.tree_mode = true;
      } else {
        this.searchCondition.tree_mode = false;
      }
      this.drawTalentTable();
    });
  
    const elPrevButton = document.getElementById("btn_prev");
  
    elPrevButton.addEventListener('click', (e) => {
      if (this.selectedTalentTreeIndex > 0) {
        const animPanel = document.getElementById('talent-anim-panel');
        animPanel.classList.remove('fadeIn');
        animPanel.classList.add('fadeOut');
  
        this.selectedTalentTreeIndex--;
        this.initTalentsTable(
          this.famousTalentInfo[this.selectedTalentTreeIndex].talent_tree, 
          this.famousTalentInfo[this.selectedTalentTreeIndex].pick_rate, 
          this.selectedTalentTreeIndex, 
          this.famousTalentInfo[this.selectedTalentTreeIndex].pick_rate
        );
  
        animPanel.classList.remove('fadeOut');
        animPanel.classList.add('fadeIn');
      }
    });
  
    const elNextButton = document.getElementById("btn_next");
  
    elNextButton.addEventListener('click', (e) => {
      if (this.selectedTalentTreeIndex < this.famousTalentInfo.length - 1) {
        const animPanel = document.getElementById('talent-anim-panel');
        animPanel.classList.remove('fadeIn');
        animPanel.classList.add('fadeOut');
  
        this.selectedTalentTreeIndex++;
        this.initTalentsTable(
          this.famousTalentInfo[this.selectedTalentTreeIndex].talent_tree, 
          this.famousTalentInfo[this.selectedTalentTreeIndex].pick_rate, 
          this.selectedTalentTreeIndex, 
          this.famousTalentInfo[this.selectedTalentTreeIndex].pick_rate
        );
  
        animPanel.classList.remove('fadeOut');
        animPanel.classList.add('fadeIn');
      }
    });
  
    const elRefreshButton = document.getElementById("btn_refresh");
    if (elRefreshButton) {
      elRefreshButton.addEventListener('click', (e) => {
        this.drawTalentTable();
      });
    }
  }
  
  private setSwitchValue(is_dungeon: boolean) {
    const container = document.getElementById("raid_dungeon-switch__container");
    this.searchCondition.is_dungeon = is_dungeon;
    container.setAttribute('data', this.searchCondition.is_dungeon ? 'dungeon' : 'raid');
    this.reloadRaidDungeonDropdown();
  
    const ranger = document.getElementById("ranger__container");
    const raidLevel = document.getElementById("key_level-select-box__container");
    const raidBoss = document.getElementById("raid_boss-select-box__container");
  
    ranger.style.display = is_dungeon ? 'block' : 'none';
    raidLevel.style.display = is_dungeon ? 'none' : 'block';
    raidBoss.style.display = is_dungeon ? 'none' : 'block';
  }
  
  private initSwitch() {
    this.setSwitchValue(true);
  
    const elSwitch = document.getElementById("raid_dungeon-switch");
    const elSwitchDungeon = document.getElementById("switch_dungeon");
    const elSwitchRaid = document.getElementById("switch_raid");
  
    elSwitch.addEventListener('click', () => {
      this.setSwitchValue(!this.searchCondition.is_dungeon);
    });
  
    elSwitchDungeon.addEventListener('click', () => {
      this.setSwitchValue(true);
    });
  
    elSwitchRaid.addEventListener('click', () => {
      this.setSwitchValue(false);
    });
  }
}
